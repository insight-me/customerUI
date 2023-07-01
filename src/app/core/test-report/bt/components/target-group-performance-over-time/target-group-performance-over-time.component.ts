import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { refreshChart } from 'src/app/shared/decorators/refresh-chart.decorator';
import { TARGET_GROUP_PERFORMANCE_OVER_TIME_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { KpiSegmentDataSet } from '../../../../../shared/models/bt.test.report/bt.brands.kpi.line.chart.dataset.model';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { BtDashboardWidgetComponent } from '../bt-dashboard-widget/bt-dashboard-widget.component';
import { GlobalFilterService } from '../global-filter.service';


@UntilDestroy()
@refreshChart()
@Component({
  selector: 'app-target-group-performance-over-time',
  templateUrl: './target-group-performance-over-time.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetGroupPerformanceOverTimeComponent
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
          if (this.btRSS.segmentOptions.getValue()) {
            this.initFilterModel(TARGET_GROUP_PERFORMANCE_OVER_TIME_LOCAL_FILTER);
          }
        })
      )
      .subscribe();
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public applyFilters(): void {
    const { brands, segments, kpis } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet)
      .find(({ brand }) => brand.id === brands)
      .kpis.find(({ id }: KpiSegmentDataSet) => id === kpis)
      .dataset.filter(({ id }) => segments[id] || id === 'population');
    this.lowNumbers = this.service.getIntervalTotalsMultiSegmentLow(segments);
    this.currentDataSet$.next(data);
  }
}
