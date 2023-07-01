import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { refreshChart } from 'src/app/shared/decorators/refresh-chart.decorator';
import { penetrationTitle } from 'src/app/shared/helpers/penetration-title';
import { LineChartDataSet } from 'src/app/shared/models/bt.test.report/line.chart.dataset';
import { BRAND_PERFOMANCE_OVER_TIME_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { BtBrandsLineChartDataSet } from '../../../../../shared/models/bt.test.report/btBrandsLineChartDataSet';
import { ListItem } from '../../../../../shared/models/test.model';
import { BtDashboardWidgetComponent } from '../bt-dashboard-widget/bt-dashboard-widget.component';
import { GlobalFilterService } from './../global-filter.service';

@UntilDestroy()
@refreshChart()
@Component({
  selector: 'app-brand-performance-over-time',
  templateUrl: './brand-performance-over-time.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BrandPerformanceOverTimeComponent
  extends BtDashboardWidgetComponent<LineChartDataSet>
  implements AfterViewInit, OnChanges, OnInit {
  public penetrationTitle = penetrationTitle;
  public currentDataSet$: BehaviorSubject<BtBrandsLineChartDataSet> = new BehaviorSubject<BtBrandsLineChartDataSet>({
    brand: null,
    dataset: [],
  });

  get penetrationInMonthes(): number {
    return this.btRSS.test.penetrationInMonthes;
  }

  constructor(protected injector: Injector,
    public ts: TranslateService,
    // ! Don't remove, because using in decorator
    private _globalFilterService: GlobalFilterService) {
    super(injector);
  }

  public ngOnInit(): void {
    this.btRSS
      .getKpiOptions()
      .pipe(
        tap((options: ListItem[]) => {
          this.kpi = options;
          this.initFilterModel(BRAND_PERFOMANCE_OVER_TIME_LOCAL_FILTER);
        })
      )
      .subscribe();

  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.refreshChart();


  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public applyFilters(): void {
    const { brands, segments, kpis } = this.filterForm.getRawValue();

    const data = cloneDeep(this.dataSet).find(({ brand }) => brand.id === brands);
    data.dataset = data.dataset.filter(kpi => kpis[kpi.id]);
    if (segments) {
      data.dataset.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.currentDataSet$.next(data);
  }

}
