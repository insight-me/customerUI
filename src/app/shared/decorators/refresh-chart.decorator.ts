import { untilDestroyed } from '@ngneat/until-destroy';
import { animationFrameScheduler } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';

/**
 * A decorator that adds a chart refresh functionality to a class.
 * The chart is refreshed whenever the `_globalFilterService.switch$` emits a value.
 *
 * @returns {Function} The decorator function.
 */
export function refreshChart() {
  return function (target: any) {
    const originalOnInit = target.prototype.ngOnInit;

    /**
     * Overrides the ngOnInit method of the decorated class.
     */
    target.prototype.ngOnInit = function (): void {
      this._globalFilterService.switch$.pipe(
        throttleTime(700),
        tap(() => {
          animationFrameScheduler.schedule(() => {
            this.refreshChart();
          });
        }
        ),
        untilDestroyed(this)
      ).subscribe();
      // Call the original ngOnInit method
      originalOnInit.apply(this, arguments);
    };
  };
}
