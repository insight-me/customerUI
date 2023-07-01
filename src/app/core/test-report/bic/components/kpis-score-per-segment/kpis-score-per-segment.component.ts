import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { BehaviorSubject } from 'rxjs';
import { CONCEPT_LOCAL_FILTER_SINGLE } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { cloneDeep } from 'lodash';
import { ConceptScorePerSegmentModel } from 'src/app/shared/models/bic.test.report/concept.score.per.segment.model';

@Component({
  selector: 'app-kpis-score-per-segment',
  templateUrl: './kpis-score-per-segment.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpisScorePerSegmentComponent extends BicLocalFiltersComponent<ConceptScorePerSegmentModel> implements OnChanges {
  @Input() public title = '';

  public dataSet$: BehaviorSubject<ConceptScorePerSegmentModel[]> = new BehaviorSubject<ConceptScorePerSegmentModel[]>([]);

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
      this.dataSet$.next(cloneDeep(this.dataSet).filter(item => item.id === concepts));
    }
    this.cdr.markForCheck();
  }
}
