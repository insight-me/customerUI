import { ChangeDetectionStrategy, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ASSOCIATIONS_IN_TARGET_GROUP } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';

@Component({
  selector: 'app-bt-association-in-target-group',
  templateUrl: './bt-association-in-target-group.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAssociationInTargetGroupComponent extends BaseLocalFiltersComponent<GroupedBarDataSet> implements OnInit, OnChanges {
  public dataSet$: BehaviorSubject<GroupedBarDataSet[]> = new BehaviorSubject<GroupedBarDataSet[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(ASSOCIATIONS_IN_TARGET_GROUP);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public applyFilters(): void {
    const { segments, associations, brands } = this.filterForm.getRawValue();

    const data = cloneDeep(this.service.associationsInTargetGroups$.getValue())
      .filter(item => associations[item.id])
      .filter(item => item.brandId === brands);

    if (segments) {
      for (const key in segments) {
        if (!segments[key]) {
          delete segments[key];
        }
      }
      const ids = Object.keys(segments);

      data.forEach(item => {
        item.values = [item.values[0], ...item.values.filter(seg => ids.includes(seg.id))];
      });
    }

    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }
}
