import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { Test } from '../../../../models/test.model';
import {
  ApproveAnswers,
  CustomQuestions,
  CustomQuestionsScreening,
} from '../../../../models/bic.test/bic.custom.questions.model';
import {
  AnswerCustomQuestionType,
  CustomQuestionType,
} from '../../../../enums/bic.custom-questions.type';
import { CUSTOM_QUESTION_ANSWER_TYPE_TEXT } from '../../../../../../assets/consts/test-creation.const';
import { TranslateService } from '@ngx-translate/core';
import { CategoryScreeningType } from 'src/app/shared/enums/category-screening.type';

@Component({
  selector: 'app-added-questions',
  templateUrl: './added-questions.component.html',
  styleUrls: ['./added-questions.component.scss'],
})
export class AddedQuestionsComponent {
  @Input() isScreens = false;
  @Input() questions: CustomQuestions[] | CustomQuestionsScreening[] = [];
  @Output() deleteCustomQuestion: EventEmitter<number> = new EventEmitter();

  constructor(private translateService: TranslateService) {}

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get CustomQuestionType(): typeof CustomQuestionType {
    return CustomQuestionType;
  }

  public get AnswerCustomQuestionType(): typeof AnswerCustomQuestionType {
    return AnswerCustomQuestionType;
  }

  public get CategoryScreeningType(): typeof CategoryScreeningType {
    return CategoryScreeningType;
  }

  public getType(question: CustomQuestions): string {
    if (question.answerType === AnswerCustomQuestionType.Default) {
      return CUSTOM_QUESTION_ANSWER_TYPE_TEXT[question.type];
    } else {
      switch (question.type) {
        case CustomQuestionType.Multi:
          return CUSTOM_QUESTION_ANSWER_TYPE_TEXT[CustomQuestionType.MultiGrid];
        case CustomQuestionType.Single:
          return CUSTOM_QUESTION_ANSWER_TYPE_TEXT[
            CustomQuestionType.SingleGrid
          ];
      }
    }
  }

  public getAnswers(question: CustomQuestions): string {
    return question.answers.map((answer) => answer.value).join(', ');
  }

  public getAnswerText(
    question: CustomQuestionsScreening,
    answers: ApproveAnswers
  ): string {
    return `${
      question.answers.find(
        (answer) => answer.position === answers.answerPosition
      ).value
    } - ${
      answers.answerColPosition === -1
        ? this.translateService.instant("BIC.Don't know")
        : question.columns.find(
            (column) => column.position === answers.answerColPosition
          ).value
    }`;
  }

  public getColumns(question: CustomQuestions): string {
    return (
      question.columns
        .filter((item) => item.position !== -1)
        .map((answer) => answer.value)
        .join(', ') +
      (question.isDontKnowOption
        ? ', ' + this.translateService.instant("BIC.Don't know")
        : '')
    );
  }

  public deleteQuestion(i: number): void {
    this.deleteCustomQuestion.emit(i);
  }
}
