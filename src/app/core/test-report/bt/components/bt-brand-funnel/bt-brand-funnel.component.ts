import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BrandFunnelDataset, BrandFunnelDatasetModel, BrandFunnelDatasetModelItem } from '../../../../../shared/models/bt.test.report/brand.funnel.dataset.model';
import { BehaviorSubject } from 'rxjs';
import { BRAND_FUNNEL } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { cloneDeep } from 'lodash';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';

@Component({
  selector: 'app-bt-brand-funnel',
  templateUrl: './bt-brand-funnel.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtBrandFunnelComponent extends BaseLocalFiltersComponent<BrandFunnelDatasetModel> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<BrandFunnelDatasetModelItem[]> = new BehaviorSubject<BrandFunnelDatasetModelItem[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(BRAND_FUNNEL);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public applyFilters(): void {
    const { brands, segments } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet)
      .filter(brand => brands[brand.brand.id])
      .map(item => {
        return {
          brand: item.brand,
          ...cloneDeep(item.dataset.find(segment => (segments ? segment.segmentId === segments : !segment.segmentId))),
        };
      })
      .sort((a, b) => {
        if (a.brand.isOwn === b.brand.isOwn) {
          return b.aidedAwareness - a.aidedAwareness;
        }
        return a.brand.isOwn === b.brand.isOwn ? 0 : a.brand.isOwn ? -1 : 1;
      });
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }
}
