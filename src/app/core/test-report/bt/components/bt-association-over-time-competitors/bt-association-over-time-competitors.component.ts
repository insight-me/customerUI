import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ASSOCIATIONS_OVER_TIME_COMPARED_TO_COMPETITORS } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { BtBrandAssociationOverTime } from 'src/app/shared/models/bt.test.report/bt.brand.association.over.time';

@Component({
  selector: 'app-bt-association-over-time-competitors',
  templateUrl: './bt-association-over-time-competitors.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAssociationOverTimeCompetitorsComponent
  extends BaseLocalFiltersComponent<BtBrandAssociationOverTime>
  implements OnInit, OnChanges
{
  public dataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(ASSOCIATIONS_OVER_TIME_COMPARED_TO_COMPETITORS);
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
      .find(item => item.association.id === associations)
      .dataset.filter(brand => brands[brand.id]);
    if (segments) {
      data.forEach(item => (item.series = item.segments.find(segment => segment[0].segment === segments)));
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }
}
