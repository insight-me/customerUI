import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CONCEPT_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { cloneDeep } from 'lodash';
import { BicDashboardType } from '../../../../../shared/enums/bic.report.dashboard.type';

@Component({
  selector: 'app-dashboard-purchase-intent',
  templateUrl: './dashboard-purchase-intent.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPurchaseIntentComponent extends BicLocalFiltersComponent<BarDataSetModel> implements OnChanges {
  @Input() public type: BicDashboardType = null;
  @Input() public title = '';

  public BicDashboardType: typeof BicDashboardType = BicDashboardType;
  public dataSet$: BehaviorSubject<BarDataSetModel[]> = new BehaviorSubject<BarDataSetModel[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER);
    }
  }

  public applyFilters(): void {
    const { concepts } = this.filterForm.getRawValue();
    if (this.dataSet) {
      this.dataSet$.next(cloneDeep(this.dataSet).filter(item => concepts[item.id]));
    }
    this.cdr.markForCheck();
  }
}
