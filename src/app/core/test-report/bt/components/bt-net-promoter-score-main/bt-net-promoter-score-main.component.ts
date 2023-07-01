import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';
import { NET_PROMOTER_SCORE_MAIN_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { InlineStyleModel } from '../../../../../shared/models/inline.style.model';
import { BehaviorSubject } from 'rxjs';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { cloneDeep } from 'lodash';
import { COLORS_NPS } from '../../../../../../assets/consts/report.const';

@Component({
  selector: 'app-bt-net-promoter-score-main',
  templateUrl: './bt-net-promoter-score-main.component.html',
  styleUrls: ['./bt-net-promoter-score-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtNetPromoterScoreMainComponent extends BaseLocalFiltersComponent<LineChartDataSet> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>([]);
  public tooltipText =
    'report.Net promoter score (NPS) measures the likelihood of a respondent recommending a company, product or a service to a friend or colleague.';
  public colors = COLORS_NPS;
  public graphContainer = [663, 400];
  public Math = Math;
  public noData = false;
  public xAxisTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  public colorScheme = {
    domain: COLORS_NPS,
  };
  public style: { [key: string]: InlineStyleModel } = {
    footer: {
      marginTop: '40px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    legend: {
      'font-size': '14px',
      'letter-spacing': '0',
      margin: '0 30px 10px 0',
      display: 'flex',
      'align-items': 'center',
      'font-family': 'GT Walsheim Pro Medium',
      'line-height': '150%',
    },
    icon: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      marginRight: '11px',
    },
  };

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(NET_PROMOTER_SCORE_MAIN_LOCAL_FILTER);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public xAxisTickFormatting = (value: number) => {
    return value + '%';
  };

  public applyFilters(): void {
    const { brands, segments } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet).filter(brand => brands[brand.id]);
    if (segments) {
      data.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.graphContainer = [663, 65 * data.length];
    this.noData = true;
    data.forEach(item => {
      if (item.series[0].totals) {
        this.noData = false;
      }
    });
    this.xAxisTicks = this.noData ? [] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    this.dataSet$.next(data);
  }
}
