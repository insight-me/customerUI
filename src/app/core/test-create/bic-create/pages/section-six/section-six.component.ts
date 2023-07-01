import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Test } from 'src/app/shared/models/test.model';
import { BicContainerComponent } from '../../components/bic-container/bic-container.component';

@Component({
  selector: 'app-section-six',
  templateUrl: './section-six.component.html',
  styleUrls: ['../../components/bic-container/bic-container.component.scss'],
})
export class SectionSixComponent
  extends BicContainerComponent
  implements OnInit, OnDestroy
{
  public test: Test = null;

  public ngOnInit(): void {
    this.currentRoute = this.route.snapshot.routeConfig.path;
    this.createTestService.nextRoute
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((route) => {
        if (route && route !== this.currentRoute && this.test) {
          this.goTo(route);
        }
      });
    this.getTest();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public goTo(route: string): void {
    this.router.navigate([
      'personal-area/create-test/bic',
      this.createTestService.testId,
      route,
    ]);
  }

  private getTest(): void {
    this.createTestService.test
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((test) => {
        if (test) {
          this.test = test;
          this.changeDetectionRef.detectChanges();
        }
      });
  }
}
