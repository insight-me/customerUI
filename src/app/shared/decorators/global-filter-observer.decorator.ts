import { untilDestroyed } from '@ngneat/until-destroy';
import { asyncScheduler } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * A decorator that adds a global filter observer to a class.
 * The observer updates the `isOpened` property of the class based on the value of `globalFilterService.isOpened$`.
 *
 * @returns {Function} The decorator function.
 */
export function GlobalFilterObserver(): any {
  return (target: any) => {
    const originalOnInit = target.prototype.ngOnInit;

    /**
     * Overrides the ngOnInit method of the decorated class.
     */
    target.prototype.ngOnInit = function (): void {
      this.globalFilterService.isOpened$
        .pipe(
          tap(val => {
            asyncScheduler.schedule(() => {
              this.isOpened = val;
              if (this.cdRef) {
                this.cdRef.markForCheck();
              }
            }, 0);
          }),
          untilDestroyed(this)
        )
        .subscribe();

      // Call the original ngOnInit method
      originalOnInit.apply(this, arguments);
    };
  };
}
