
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractGlobalFiltersComponent } from 'src/app/shared/base/abstract-global-filters.component';
import { TimeInternal } from 'src/app/shared/enums/period.enum';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { ListItem } from 'src/app/shared/models/test.model';
import { LoadingService } from 'src/app/shared/services/app-state/loader.service';
import { BtReportStateService } from '../../bt.report.state.service';
import { GlobalFilterService } from '../global-filter.service';
import { AppStateService } from './../../../../../shared/services/app-state/app-state.service';


@Component({
  selector: 'app-bt-global-filter',
  templateUrl: './bt-global-filter.component.html',
  styleUrls: ['./bt-global-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtGlobalFilterComponent extends AbstractGlobalFiltersComponent implements OnInit {
  public testType = TestType.BT;


  public disableDate = (current: Date): boolean => {
    const testStartDate = new Date(this.testStartDate);
    const currentDate = new Date();

    switch (this.periodValue) {
      case TimeInternal.Monthly:
        const lastDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return !(current.getMonth() >= testStartDate.getMonth() && current <= lastDayOfNextMonth);
      case TimeInternal.Weekly:
        if (current > currentDate) {
          const dayOfWeek = currentDate.getDay();
          const diff = 6 - dayOfWeek;
          const endDate = new Date(currentDate);
          endDate.setDate(currentDate.getDate() + diff + 1);
          return current < testStartDate || current > endDate;
        }

        if (testStartDate > current) {
          const startOfWeek: Date = new Date(testStartDate);
          const dayOfWeek = startOfWeek.getDay();

          if (dayOfWeek !== 1) {
            const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            startOfWeek.setDate(startOfWeek.getDate() - diff);
          }

          startOfWeek.setHours(0, 0, 0, 0);
          return current < startOfWeek;
        }


        return current < testStartDate || current > currentDate;
      default:
        return current < testStartDate || current > currentDate;
    }
  }




  constructor(
    protected fb: FormBuilder,
    protected globalFiltersService: GlobalFilterService,
    protected appStateService: AppStateService,
    protected cdRef: ChangeDetectorRef,
    private btReportStateService: BtReportStateService,
    public loadingService: LoadingService
  ) {
    super(fb, globalFiltersService, appStateService, cdRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public open(): void {
    this.isOpened = !this.isOpened;
    this.globalFiltersService.isOpened$.next(this.isOpened);
  }


  public clearHandler(value: ListItem, controlName: string): void {
    this.form.get(controlName).patchValue(value ? value : this.allOption);
  }

  protected setService(): void {
    this.dataService = this.btReportStateService;
  }

  protected createForm(): void {
    this.form = this.fb.group({
      category: this.fb.control(this.subCategory[0]),
      countryIds: this.fb.control(null),
      regions: this.fb.control(null),
      startDate: this.fb.control(this.getCurrentAndPreviousMonthDate()[0]),
      endDate: this.fb.control(this.getCurrentAndPreviousMonthDate()[1]),
      period: this.fb.control(this.timeInternal[0]),
      population: this.fb.control(this.populationOptions[0]),
      gender: this.fb.control({ id: 'All', value: 'All' }),
      fromAge: this.fb.control(this.test.respondentRequirements.minAge),
      toAge: this.fb.control(this.test.respondentRequirements.maxAge),
      purchase: this.fb.control({ id: 'All', value: 'All' }),
      movingAverage: this.fb.control(true),
    });
  }

}
