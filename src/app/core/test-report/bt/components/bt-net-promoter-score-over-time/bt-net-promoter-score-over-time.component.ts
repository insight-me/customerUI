import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BtDashboardWidgetComponent } from '../bt-dashboard-widget/bt-dashboard-widget.component';
import { BehaviorSubject } from 'rxjs';
import { BtBrandsLineChartDataSet } from '../../../../../shared/models/bt.test.report/btBrandsLineChartDataSet';
import { NET_PROMOTER_SCORE_OVER_SCORE_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { COLORS_NPS } from '../../../../../../assets/consts/report.const';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-bt-net-promoter-score-over-time',
  templateUrl: './bt-net-promoter-score-over-time.component.html',
  styleUrls: ['./bt-net-promoter-score-over-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtNetPromoterScoreOverTimeComponent extends BtDashboardWidgetComponent<BtBrandsLineChartDataSet> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<BtBrandsLineChartDataSet> = new BehaviorSubject<BtBrandsLineChartDataSet>(null);
  public tooltipText =
    'report.Net promoter score (NPS) measures the likelihood of a respondent recommending a company, product or a service to a friend or colleague.';
  public colors = COLORS_NPS;
  public colorScheme = {
    name: 'coolthree',
    selectable: true,
    group: 'Ordinal',
    domain: COLORS_NPS,
  };
  public yAxisTicks = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100];
  public graphContainer = [1000, 500];

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(NET_PROMOTER_SCORE_OVER_SCORE_LOCAL_FILTER);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public get legend(): string[] {
    return ['Detractors', 'Passives', 'Promoters', 'NPS score'];
  }

  public yAxisTickFormatting = (value: number) => {
    return value + '%';
  };

  public applyFilters(): void {
    const { brands, segments } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet).find(({ brand }) => brand.id === brands);
    if (segments) {
      data.dataset.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    data.dataset[0].npsSeries = cloneDeep(data.dataset[0].series);
    data.dataset[0].npsSeries.forEach(series => {
      series.value = series.nps;
      return series;
    });
    this.dataSet$.next(data);
  }
}
