
import { ChangeDetectionStrategy, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { CONCEPT_LOCAL_FILTER_SINGLE } from '../../../../../assets/consts/bic.report.local-filters.consts';
import { AdditionalQuestionsModel, QuestionFeedback } from '../../../../shared/models/bic.test.report/additional.questions.model';
import { BTTest } from '../../../../shared/models/bt-test.model';
import { Test } from '../../../../shared/models/test.model';
import { ReportCustomQuestionsService } from '../../report.custom-questions.service';
import { BaseCustomQuestionFiltersComponent } from '../base-custom-question-filters/base-custom-question-filters.component';

@Component({
  selector: 'app-additional-questions',
  templateUrl: './additional-questions.component.html',
  styleUrls: ['../../bic/components/concept-definitions/concept-definitions.component.scss', '../base-content/base-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalQuestionsComponent extends BaseCustomQuestionFiltersComponent<Test | BTTest> implements OnInit, OnDestroy {
  public isChooseConceptActive = false;
  public selectedConcept = 0;
  public selectedQuestion = 0;
  public num = 1;

  constructor(protected injector: Injector, public reportCustomQuestionsService: ReportCustomQuestionsService<Test>) {
    super(injector);
  }

  get tabNumber(): number {
    return this.reportCustomQuestionsService.tabNumber;
  }

  public ngOnInit(): void {
    if (this.tabNumber) {
      this.selectedQuestion = this.tabNumber;
    }

    if (this.reportCustomQuestionsService.isBic) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER_SINGLE);
    }
  }

  public ngOnDestroy(): void {
    this.reportCustomQuestionsService.tabNumber = this.selectedQuestion;
  }


  public isBIC(testType: TestType): boolean {
    return testType === TestType.BIC;
  }

  public getTabName(tab: QuestionFeedback, i: number): string {
    return 'report.Question' + ' ' + (i + 1);
  }

  public isShowConcepts(dataSet: AdditionalQuestionsModel[]): boolean {
    if (dataSet.length - 1 < this.selectedConcept) {
      this.selectedConcept = 0;
    }
    return dataSet.length > 1;
  }

  public applyFilters(): void {
    const { concepts } = this.filterForm.getRawValue();
    this.selectedConcept = (this.reportCustomQuestionsService.test as Test).concepts.findIndex(item => item.id === concepts);
  }
}
