import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AD_AWARENESS_OVER_TIME_LOCAL_FILTER
} from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { BtBrandsLineChartDataSet } from '../../../../../shared/models/bt.test.report/btBrandsLineChartDataSet';
import { InlineStyleModel } from '../../../../../shared/models/inline.style.model';
import { ListItem } from '../../../../../shared/models/test.model';
import { BtDashboardWidgetComponent } from '../bt-dashboard-widget/bt-dashboard-widget.component';

@Component({
  selector: 'app-bt-ad-awareness-over-time',
  templateUrl: './bt-ad-awareness-over-time.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAdAwarenessOverTimeComponent extends BtDashboardWidgetComponent<BtBrandsLineChartDataSet> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<BtBrandsLineChartDataSet> = new BehaviorSubject<BtBrandsLineChartDataSet>(null);
  public style: { [key: string]: InlineStyleModel } = {
    footer: {
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
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
    this.service
      .getKpiOptions()
      .pipe(
        tap((options: ListItem[]) => {
          this.kpi = options;
          this.initFilterModel(AD_AWARENESS_OVER_TIME_LOCAL_FILTER);
        })
      )
      .subscribe();
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
    const data = cloneDeep(this.dataSet).find(({ brand }) => brand.id === brands);
    data.dataset = data.dataset.filter(kpi => kpis[kpi.id] || kpi.id === 'adAwareness');
    if (segments) {
      data.dataset.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }
}
