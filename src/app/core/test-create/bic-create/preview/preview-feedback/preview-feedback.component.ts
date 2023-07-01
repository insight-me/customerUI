import { AfterViewInit, Component, Input } from '@angular/core';
import {
  AnswerCustomQuestionType,
  CustomQuestionType,
  OrderCustomQuestionType
} from 'src/app/shared/enums/bic.custom-questions.type';
import { MAX_MARK_KPI } from 'src/assets/consts/consts';
import { getRandomArray } from '../../../../../shared/utils/random-array.utils';

@Component({
  selector: 'app-preview-feedback',
  templateUrl: './preview-feedback.component.html',
  styleUrls: [
    './preview-feedback.component.scss',
    '../../components/bic-container/bic-container.component.scss',
    '../../components/preview-slider/preview-slider.component.scss',
    '../../../../../shared/test-creation-components/components/open-questions/open-questions-preview/open-questions-preview.component.scss',
  ],
})
export class PreviewFeedbackComponent implements AfterViewInit {
  @Input() like = false;
  @Input() think = false;
  @Input() customQuestions: any[] = [];
  @Input() subtitle = 'preview.header-questions';
  public options: number[] = Array.from(Array(MAX_MARK_KPI).keys()).map(
    (item) => item + 1
  );


  constructor() { }

  public ngAfterViewInit(): void {
    this.customQuestions.forEach((question) => {
      if (question.columnOrderType === OrderCustomQuestionType.Random) {
        question.columns = getRandomArray(question.columns);
      }
      if (question.answerOrderType === OrderCustomQuestionType.Random) {
        question.answers = getRandomArray(question.answers);
      }
    });
  }

  public get CustomQuestionType(): typeof CustomQuestionType {
    return CustomQuestionType;
  }

  public get AnswerCustomQuestionType(): typeof AnswerCustomQuestionType {
    return AnswerCustomQuestionType;
  }

  public getExplanationText(
    type: CustomQuestionType,
    answerType: AnswerCustomQuestionType
  ): string {
    let text = '';
    if (answerType === AnswerCustomQuestionType.Default) {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you';
      }
    } else {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer per row';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you per row';
      }
    }
    return text;
  }

  public getMobileExplanationText(
    type: CustomQuestionType,
    answerType: AnswerCustomQuestionType
  ): string {
    let text = '';
    if (answerType === AnswerCustomQuestionType.Default) {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you';
      }
    } else {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer per column';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you per column';
      }
    }
    return text;
  }
}
