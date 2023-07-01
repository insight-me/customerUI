import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { refreshChart } from 'src/app/shared/decorators/refresh-chart.decorator';
import { COMPETITORS_PERFORMANCE_OVER_TIME_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { KpiSegmentDataSet } from '../../../../../shared/models/bt.test.report/bt.brands.kpi.line.chart.dataset.model';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { BtDashboardWidgetComponent } from '../bt-dashboard-widget/bt-dashboard-widget.component';
import { GlobalFilterService } from '../global-filter.service';

@UntilDestroy()
@refreshChart()
@Component({
  selector: 'app-competitors-performance-over-time',
  templateUrl: './competitors-performance-over-time.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitorsPerformanceOverTimeComponent
  extends BtDashboardWidgetComponent<LineChartDataSet[]>
  implements OnInit, AfterViewInit, OnChanges {
  public currentDataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>([]);

  constructor(protected injector: Injector, private _globalFilterService: GlobalFilterService) {
    super(injector);
  }

  public ngOnInit(): void {
    this.btRSS
      .getKpiOptions()
      .pipe(
        tap(list => {
          this.kpi = list;
          this.initFilterModel(COMPETITORS_PERFORMANCE_OVER_TIME_LOCAL_FILTER);
        })
      )
      .subscribe();

    // this._globalFilterService.switch$.pipe(
    //   delay(600),
    //   tap(() => this.refreshChart()),
    //   untilDestroyed(this)
    // );
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

  public colorScheme(data): string[] {
    return [...data].map(item => item.color);
  }

  public applyFilters(): void {
    const { brands, segments, kpis } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet)
      .find(({ id }: KpiSegmentDataSet) => id === kpis)
      .dataset.filter(brand => brands[brand.id]);
    if (segments) {
      data.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.currentDataSet$.next(data);
  }
}
