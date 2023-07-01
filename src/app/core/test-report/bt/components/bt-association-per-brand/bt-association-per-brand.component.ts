import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { BtBrandsLineChartDataSet } from 'src/app/shared/models/bt.test.report/btBrandsLineChartDataSet';
import { ASSOCIATIONS_OVER_TIME_PER_PERIOD } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';

@Component({
  selector: 'app-bt-association-per-brand',
  templateUrl: './bt-association-per-brand.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtAssociationPerBrandComponent extends BaseLocalFiltersComponent<BtBrandsLineChartDataSet> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>([]);
  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(ASSOCIATIONS_OVER_TIME_PER_PERIOD);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public toggleZoom(index: number): void {
    this.service.associationsExpandedCharts.has(index)
      ? this.service.associationsExpandedCharts.delete(index)
      : this.service.associationsExpandedCharts.add(index);
  }

  public applyFilters(): void {
    const { brands, segments, associations } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet)
      .find(item => item.brand.id === brands)
      .dataset.filter(assoc => associations[assoc.id]);
    if (segments) {
      data.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }

}
