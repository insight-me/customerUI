import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { CONCEPT_LOCAL_FILTER_SINGLE } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';

@Component({
  selector: 'app-kpi-purchase-frequancy',
  templateUrl: './kpi-purchase-frequancy.component.html',
  styleUrls: [
    '../concept-definitions/concept-definitions.component.scss',
    '../../../components/custom-question-preview/custom-question-preview.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiPurchaseFrequancyComponent extends BicLocalFiltersComponent<BarDataSetModel> implements OnChanges {
  @Input() public title = '';

  public dataSet$: BehaviorSubject<BarDataSetModel[]> = new BehaviorSubject<BarDataSetModel[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER_SINGLE);
    }
  }

  public applyFilters(): void {
    const { concepts } = this.filterForm.getRawValue();
    if (this.dataSet) {
      this.dataSet$.next(cloneDeep(this.dataSet).filter(item => item.id === concepts)[0]);
    }
    this.cdr.markForCheck();
  }
}
