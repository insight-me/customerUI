import { ChangeDetectionStrategy, Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { CONCEPT_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { BehaviorSubject } from 'rxjs';
import { BubbleDataSetModel } from 'src/app/shared/models/bic.test.report/bubble.data.set.model';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-overal-score',
  templateUrl: './overal-score.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OveralScoreComponent extends BicLocalFiltersComponent<BubbleDataSetModel> implements OnChanges {
  public dataSet$: BehaviorSubject<BubbleDataSetModel[]> = new BehaviorSubject<BubbleDataSetModel[]>([]);

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
