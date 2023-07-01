import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { QuestionFeedback } from '../../../../shared/models/bic.test.report/additional.questions.model';
import { CUSTOM_QUESTION_ANSWER_TYPE_TEXT } from '../../../../../assets/consts/test-creation.const';
import { AnswerCustomQuestionType, CustomQuestionType } from '../../../../shared/enums/bic.custom-questions.type';
import { ChartType } from '../../../../shared/enums/bic.report.tab.type';
import { BarDataSetModel } from '../../../../shared/models/bic.test.report/bar.data.set.model';
import { cloneDeep } from 'lodash';
import { FEEDBACK_LIKE, FEEDBACK_THINK } from 'src/assets/consts/report.const';
import { TranslateService } from '@ngx-translate/core';
import { TestType } from '../../../../shared/enums/product.id.type';
import { CustomQuestionsFiltersComponent } from '../custom-questions-filters/custom-questions-filters.component';
import { ReportCustomQuestionsService } from '../../report.custom-questions.service';

@Component({
  selector: 'app-custom-question-preview',
  templateUrl: './custom-question-preview.component.html',
  styleUrls: [
    './custom-question-preview.component.scss',
    '../../bic/components/questions-feedback-item/questions-feedback-item.component.scss',
    '../../bic/components/concept-definitions/concept-definitions.component.scss',
  ],
})
export class CustomQuestionPreviewComponent implements OnChanges {
  @Input() public question: QuestionFeedback;
  @Input() public testType: TestType;

  @ViewChild(CustomQuestionsFiltersComponent) public customQuestionsFilters: CustomQuestionsFiltersComponent;

  public testTypeEnum: typeof TestType = TestType;
  public CustomQuestionType = CustomQuestionType;
  public AnswerCustomQuestionType = AnswerCustomQuestionType;
  public ChartType = ChartType;
  public currentQuestion: QuestionFeedback = null;
  public initialQuestion: QuestionFeedback = null;
  public selectSegments = false;

  private _currentQuestionId = '';

  constructor(private translateService: TranslateService, public customQuestionService: ReportCustomQuestionsService<any>) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this._currentQuestionId === this.question.id) {
    } else {
      this.customQuestionsFilters?.resetQuestion();
    }
    this._currentQuestionId = this.question.id;
    this.initialQuestion = cloneDeep(this.question);
    this.currentQuestion = cloneDeep(this.question);
  }

  public isFeedback(): boolean {
    return !(this.currentQuestion.id === FEEDBACK_LIKE || this.currentQuestion.id === FEEDBACK_THINK);
  }

  public isSingleAndMulti(): boolean {
    return this.currentQuestion.type === CustomQuestionType.Single || this.currentQuestion.type === CustomQuestionType.Multi;
  }

  public isAnswerTypeDefault(): boolean {
    return this.currentQuestion.answerType === AnswerCustomQuestionType.Default;
  }

  public get hasSegmentData(): boolean {
    return (
      this.customQuestionService.test.respondentRequirements.isCustomSegmentation ||
      this.customQuestionService.test.respondentRequirements.isSegmentation
    );
  }

  public getAnswerType(): string {
    if (this.currentQuestion.answerType === AnswerCustomQuestionType.Default) {
      return CUSTOM_QUESTION_ANSWER_TYPE_TEXT[this.currentQuestion.type];
    } else {
      switch (this.currentQuestion.type) {
        case CustomQuestionType.Multi:
          return CUSTOM_QUESTION_ANSWER_TYPE_TEXT[CustomQuestionType.MultiGrid];
        case CustomQuestionType.Single:
          return CUSTOM_QUESTION_ANSWER_TYPE_TEXT[CustomQuestionType.SingleGrid];
      }
    }
  }

  public filterData(data: BarDataSetModel[]): void {
    this.currentQuestion.dataSet = data;
  }
}
