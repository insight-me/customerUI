import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { BehaviorSubject } from 'rxjs';
import { CONCEPT_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { cloneDeep } from 'lodash';
import { ConceptBenefitsReasonsModel } from '../../../../../shared/models/bic.test.report/concept.benefits.reasons.model';
import { ConceptReportTableDataType } from 'src/app/shared/enums/concept.report.table.data.type';

@Component({
  selector: 'app-rtb-local-filters',
  templateUrl: './rtb-local-filters.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RTBLocalFiltersComponent extends BicLocalFiltersComponent<ConceptBenefitsReasonsModel> implements OnChanges {
  @Input() public title = '';
  @Input() public type: ConceptReportTableDataType = null;

  public ConceptReportTableDataType = ConceptReportTableDataType;
  public dataSet$: BehaviorSubject<ConceptBenefitsReasonsModel | ConceptBenefitsReasonsModel[]> = new BehaviorSubject<
    ConceptBenefitsReasonsModel | ConceptBenefitsReasonsModel[]
  >(null);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER);
    }
  }

  public setConcepts(): void {
    if (Array.isArray(this.dataSet)) {
      const conceptInd = this.filterModel.findIndex(item => item.formControlName === 'concepts');
      if (conceptInd !== -1) {
        const concepts = cloneDeep(this.dataSet).filter(concept => concept.accumulatedData.length);
        this.filterModel[conceptInd].options = concepts.map(item => {
          return { ...item.concept, value: item.concept.conceptName };
        });
      }
    } else {
      super.setConcepts();
    }
  }

  public applyFilters(): void {
    const { concepts } = this.filterForm.getRawValue();
    let data = cloneDeep(this.dataSet);
    if (Array.isArray(this.dataSet)) {
      data = data.filter(item => concepts[item.concept.id]);
    } else {
      data.accumulatedData = data.accumulatedData.filter(item => concepts[item.id]);
    }
    this.dataSet$.next(data);
    this.cdr.markForCheck();
  }
}
