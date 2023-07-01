import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';
import { AD_AWARENESS_MAIN_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { BehaviorSubject } from 'rxjs';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { cloneDeep } from 'lodash';
import { InlineStyleModel } from '../../../../../shared/models/inline.style.model';

@Component({
  selector: 'app-bt-ad-awareness-main',
  templateUrl: './bt-ad-awareness-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAdAwarenessMainComponent extends BaseLocalFiltersComponent<LineChartDataSet> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>([]);
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
    this.initFilterModel(AD_AWARENESS_MAIN_LOCAL_FILTER);
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
    const { brands, segments } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet).filter(brand => brands[brand.id]);
    if (segments) {
      data.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }
}
