import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep, isEqual, omit } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { StatementNameType, StatementType, Test } from 'src/app/shared/models/test.model';
import { BicContainerComponent } from '../../components/bic-container/bic-container.component';

@Component({
  selector: 'app-section-two',
  templateUrl: './section-two.component.html',
  styleUrls: ['./section-two.component.scss', '../../components/bic-container/bic-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTwoComponent extends BicContainerComponent implements OnInit, OnDestroy {
  public test: Test = null;
  public allStatements = [];
  public selectedKpi = null;
  private lang = 'EN';

  public ngOnInit(): void {
    this.currentRoute = this.route.snapshot.routeConfig.path;
    this.createTestService.nextRoute.pipe(takeUntil(this.ngUnsubscribe)).subscribe(route => {
      if (route && route !== this.currentRoute && this.test) {
        this.goTo(route);
      }
    });
    this.getTest();
    this.appStateService.language.subscribe(lang => {
      this.lang = lang;
      this.getStatements();
    });
  }

  public ngOnDestroy(): void {
    if (this.compareTest()) {
      this.bicTestService.updateTest(omit(this.test, ['respondentRequirements', 'concepts'])).subscribe(res => {
        this.createTestService.currentTest$.next(res);
      });
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get statementEnum(): typeof StatementType {
    return StatementType;
  }

  public get statementNameType(): typeof StatementNameType {
    return StatementNameType;
  }

  public updateKPI(): void {
    this.test.testKPIs = this.allStatements.filter(kpi => kpi.isRequired || this.selectedKpi[kpi.id]);
  }

  public goTo(route: string): void {
    if (this.compareTest()) {
      this.bicTestService.updateTest(omit(this.test, ['respondentRequirements', 'concepts'])).subscribe(res => {
        this.createTestService.currentTest$.next(res);
        this.router.navigate(['personal-area/create-test/bic', this.createTestService.testId, route]);
      });
    } else {
      this.router.navigate(['personal-area/create-test/bic', this.createTestService.testId, route]);
    }
  }

  private compareTest(): boolean {
    return isEqual(this.test.testKPIs, this.initTest.testKPIs);
  }

  private getStatements(): void {
    this.bicTestService.getStatements().subscribe(res => {
      this.allStatements = res;
      this.selectedKpi = {};
      res
        .filter(item => !item.isRequired)
        .forEach(item => {
          this.selectedKpi[item.id] = this.test.testKPIs.map(kpi => kpi.id).includes(item.id);
        });
      this.changeDetectionRef.detectChanges();
    });
  }

  private getTest(): void {
    this.createTestService.test.pipe(takeUntil(this.ngUnsubscribe)).subscribe(test => {
      if (test) {
        this.initTest = cloneDeep(test);
        this.test = test;
        this.checkFirstEnter();
        this.getStatements();
      }
    });
  }

  private checkFirstEnter(): void {
    if (!this.test.isEnterKPIStep) {
      this.test.isEnterKPIStep = true;
    }
  }
}
