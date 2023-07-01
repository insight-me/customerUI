import { Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { BicReportStateService } from '../../bic.report.state.service';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { TotalRelevanceModel } from '../../../../../shared/models/bic.test.report/total.relevance.model';
import { BehaviorSubject } from 'rxjs';
import { CONCEPT_LOCAL_FILTER_SINGLE } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { cloneDeep } from 'lodash';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';

@Component({
  selector: 'app-moodboard-likes',
  templateUrl: './moodboard-likes.component.html',
  styleUrls: ['./moodboard-likes.component.scss', '../concept-definitions/concept-definitions.component.scss'],
})
export class MoodboardLikesComponent extends BicLocalFiltersComponent<ConsumerInsightModel> implements OnChanges {
  public IconsType = IconsType;
  public dataSet$: BehaviorSubject<ConsumerInsightModel> = new BehaviorSubject<ConsumerInsightModel>(null);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER_SINGLE);
    }
  }

  public setConcepts(): void {
    const conceptInd = this.filterModel.findIndex(item => item.formControlName === 'concepts');
    if (conceptInd !== -1) {
      const concepts = cloneDeep(this.dataSet).filter(concept => concept.concept.moodboard?.items.length);
      this.filterModel[conceptInd].options = concepts.map(item => {
        return { ...item.concept, value: item.concept.conceptName };
      });
    }
  }

  public applyFilters(): void {
    let { concepts } = this.filterForm.getRawValue();
    if (!this.filterModel[0].options.find(concept => concept.id === concepts)) {
      this.filterForm.controls.concepts.setValue(this.filterModel[0].options[0].id);
      concepts = this.filterForm.controls.concepts.value;
    }
    if (this.dataSet) {
      this.dataSet$.next(cloneDeep(this.dataSet).find(item => item.concept.id === concepts));
    }
    this.cdr.markForCheck();
  }
}
