import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MONTHS_IN_FIRST, MONTHS_IN_YEAR } from '../../../../../../assets/consts/consts';
import { DropdownDataType } from '../../../../../shared/enums/dropdown.type';
import { mockPeriodBtTestKPI } from '../../../../../shared/mock/products.mock';
import { StatementType } from '../../../../../shared/models/test.model';
import { BaseSectionComponent } from '../base-section/base-section.component';

@Component({
  selector: 'app-section-four',
  templateUrl: './section-four.component.html',
  styleUrls: [
    './section-four.component.scss',
    '../../../.././test-create/bic-create/components/bic-container/bic-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFourComponent extends BaseSectionComponent implements OnInit, OnDestroy {
  public currentSection = 'section-4';
  public periodKpi = mockPeriodBtTestKPI;
  public penetrationItem = 'month';
  public penetrationSelectedTimePeriod = '<SELCTED_TIME_PERIOD>';
  public btTestKpis$: Observable<any>;
  public get DropdownDataType(): typeof DropdownDataType {
    return DropdownDataType;
  }

  public get statementEnum(): any {
    return StatementType;
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public setInitActions(): void {
    this.setValuePeriodItem();
    this.btTestKpis$ = this.btTestService.getTestKPIs().pipe(tap(data => {
      this.test.testKPIs = data;
    }));
    this.checkFirstEnter();
    this.cdr.detectChanges();
  }

  public setValuePeriodItem(): void {
    this.periodKpi.forEach(item => {
      if (item.count === this.test?.penetrationInMonthes) {
        this.penetrationItem = item.countryName;
      }
    });
  }

  public onChangePeriod(event): void {
    this.penetrationItem = event.countryName;
    this.test.penetrationInMonthes = event.count;
    this.cdr.detectChanges();
  }

  public get checkIfHaveChanges(): boolean {
    return this.initTest?.penetrationInMonthes !== this.test?.penetrationInMonthes ||
      this.initTest.isEnterKPIStep !== this.test?.isEnterKPIStep;
  }

  private checkFirstEnter(): void {
    if (!this.test.isEnterKPIStep) {
      this.test.isEnterKPIStep = true;
    }
  }

  public get penetrationQuestion(): string {
    switch (this.penetrationItem) {
      case MONTHS_IN_YEAR:
        return 'year';
      case MONTHS_IN_FIRST:
        return 'month';
      default:
        return this.penetrationItem;
    }
  }
}
