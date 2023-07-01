import { Injectable } from '@angular/core';
import { Test } from '../../models/test.model';
import { BehaviorSubject } from 'rxjs';
import { BicTestService } from '../bic-test/bic-test.service';
import { CalcTimeModel } from '../../models/bic.test/calc.time.model';
import { AnswerCustomQuestionType } from '../../enums/bic.custom-questions.type';
import { MAX_BIC_TIME } from '../../../../assets/consts/test-creation.const';
import { RespondentsService } from '../../../core/test-create/bic-create/services/respondents.service';
import { BicCreateService } from '../../../core/test-create/bic-create/services/bic-create.service';

@Injectable({
  providedIn: 'root',
})
export class CalcTimeService {
  public timeBIC: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public isExceedBICLimit = false;
  public isShowedPopup = false;

  constructor(
    private bicTestService: BicTestService,
  ) {
  }

  public calcTestBICTime(test: Test): void {
    if (test) {
      this.bicTestService
        .calcTestTimeBIC(this.createCalcTimeObj(test))
        .subscribe({
          next: (time) => {
            this.isExceedBICLimit = time > MAX_BIC_TIME;
            if (!this.isExceedBICLimit) {
              this.isShowedPopup = false;
            }
            this.timeBIC.next(time);
          },
        });
    }
  }

  private createCalcTimeObj(test: Test): CalcTimeModel {
    return {
      background: true,
      segmentation:
        test?.respondentRequirements?.isCustomSegmentation ||
        test?.respondentRequirements?.isSegmentation,
      concept: test?.concepts.length,
      kpi: !!test?.testKPIs.length,
      association:
        test?.testAssociations.length + test?.customAssociations.length,
      likeDislikeMoodboard: test?.imageLikesEnabled,
      likeDislikeWord: test?.wordsLikesEnabled,
      openFeedback: test?.feedbackLike || test?.feedbackThink,
      relevance: test?.testConceptRelevance,
      frequency: test?.purchaseFrequencyEnabled,
      customQuestion: test?.customQuestions.filter(
        (question) => question.answerType === AnswerCustomQuestionType.Default
      ).length,
      customQuestionGrid: test?.customQuestions.filter(
        (question) => question.answerType === AnswerCustomQuestionType.Grid
      ).length,
    };
  }
}
