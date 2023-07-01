import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, sortBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { AnswerCustomQuestionType, CustomQuestionType } from '../../shared/enums/bic.custom-questions.type';
import { TestType } from '../../shared/enums/product.id.type';
import { AdditionalQuestionsModel, QuestionFeedback } from '../../shared/models/bic.test.report/additional.questions.model';
import { BarGridData } from '../../shared/models/bic.test.report/bar.data.set.model';
import { AccumulatedFeedback } from '../../shared/models/bic.test.report/test.concept.result.model';
import { BTTest } from '../../shared/models/bt-test.model';
import { IntervalTotals } from '../../shared/models/bt.test.report/bt.test.result.model';
import { ListItem, Test, TestConcept } from '../../shared/models/test.model';
import { TestReportUtils } from '../../shared/utils/test.report.utils';

@Injectable()
export class ReportCustomQuestionsService<T extends Test | BTTest> {
  public test: T = null;
  public isBic = false;
  public additionalQuestionsDataSet$: BehaviorSubject<AdditionalQuestionsModel[]> = new BehaviorSubject<AdditionalQuestionsModel[]>(null);
  public pdfScaledQuestionsDataSet$: BehaviorSubject<AdditionalQuestionsModel[]> = new BehaviorSubject<AdditionalQuestionsModel[]>([]);
  public pdfSingleQuestionsDataSet$: BehaviorSubject<AdditionalQuestionsModel[]> = new BehaviorSubject<AdditionalQuestionsModel[]>([]);
  public pdfMultiQuestionsDataSet$: BehaviorSubject<AdditionalQuestionsModel[]> = new BehaviorSubject<AdditionalQuestionsModel[]>([]);
  public pdfSingleGridQuestionsDataSet$: BehaviorSubject<AdditionalQuestionsModel[]> = new BehaviorSubject<AdditionalQuestionsModel[]>([]);
  public pdfMultiGridQuestionsDataSet$: BehaviorSubject<AdditionalQuestionsModel[]> = new BehaviorSubject<AdditionalQuestionsModel[]>([]);
  public switcher$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public intervalTotals$: BehaviorSubject<IntervalTotals> = new BehaviorSubject<IntervalTotals>(null);
  public availableSegments: ListItem[] = [];
  public tabNumber: number;
  private _questions: QuestionFeedback[] = [];
  private _additionalQuestionsDataSet: AdditionalQuestionsModel[] = [];
  private _segmentOptions$: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  private _genderOptions$: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);

  constructor(private translateService: TranslateService) {}

  public get segmentOptions$(): BehaviorSubject<ListItem[]> {
    return this._segmentOptions$;
  }

  public setTest(test: T): void {
    this.test = cloneDeep(test);
    this.isBic = this.test.testType === TestType.BIC;
    this._questions = JSON.parse(JSON.stringify(TestReportUtils.getTestQuestions(this.test.customQuestions, this.translateService)));
  }

  public resetCustomQuestionsData(): void {
    this._additionalQuestionsDataSet = [];
    this.additionalQuestionsDataSet$.next([]);
    this.pdfScaledQuestionsDataSet$.next([]);
    this.pdfSingleQuestionsDataSet$.next([]);
    this.pdfSingleGridQuestionsDataSet$.next([]);
    this.pdfMultiQuestionsDataSet$.next([]);
    this.pdfMultiGridQuestionsDataSet$.next([]);
  }

  public setSegmentAndGenderOptions(segmentOptions, genderOptions): void {
    this._segmentOptions$ = segmentOptions;
    this._genderOptions$ = genderOptions;
  }

  public createDataSetItem(
    concept: TestConcept,
    {
      accumulatedQuestionFeedbacks,
      accumulatedFeedbacks,
      accumulatedScales,
      accumulatedSingles,
      accumulatedMulties,
      accumulatedLIkeAnswers,
      accumulatedThinksAnswers,
      orRespondentCount,
    }: any
  ): void {
    this._feedbackMapper(accumulatedQuestionFeedbacks ?? accumulatedFeedbacks);
    this._feedbackMapper(accumulatedLIkeAnswers);
    this._feedbackMapper(accumulatedThinksAnswers);
    const additionalQuestionsDataSetItem: AdditionalQuestionsModel = {
      id: concept ? concept.id : this.test.id,
      label: concept ? concept.conceptName : '',
      testType: this.test.testType,
      feedback: cloneDeep(this._questions).map((feedback): QuestionFeedback => {
        feedback.numberOfResp = orRespondentCount || 0;
        switch (feedback.type) {
          case CustomQuestionType.Open:
            this._getOpenQuestionDataSetItem(feedback, accumulatedQuestionFeedbacks ?? accumulatedFeedbacks);
            return feedback;
          case CustomQuestionType.Scale:
            this._getScaleQuestionDataSetItem(feedback, accumulatedScales);
            return feedback;
          case CustomQuestionType.Single:
            this._getSingleQuestionDataSetItem(feedback, accumulatedSingles);
            return feedback;
          case CustomQuestionType.Multi:
            this._getMultiQuestionDataSetItem(feedback, accumulatedMulties);
            return feedback;
        }
      }),
    };
    if ((this.test as Test).feedbackLike) {
      additionalQuestionsDataSetItem.feedback.push({
        id: 'feedbackLike',
        label: this.translateService.instant('BIC.What do you like most about the idea?'),
        answers: accumulatedLIkeAnswers,
        tabName: 'Feedback Like',
        numberOfResp: orRespondentCount,
        columns: [],
      });
    }
    if ((this.test as Test).feedbackThink) {
      additionalQuestionsDataSetItem.feedback.push({
        id: 'feedbackThink',
        label: this.translateService.instant('BIC.What do you think can be improved with the idea?'),
        answers: accumulatedThinksAnswers,
        tabName: 'Feedback Think',
        numberOfResp: orRespondentCount,
        columns: [],
      });
    }
    this._additionalQuestionsDataSet.push(additionalQuestionsDataSetItem);
    this._refreshChart();
  }

  public setCustomQuestionsDataSet(): void {
    this.additionalQuestionsDataSet$.next(this._additionalQuestionsDataSet);
    this._setAdditionalQuestionsDataForPDF();
  }

  public setIntervalTotals(intervalTotals: IntervalTotals): void {
    this.intervalTotals$.next(intervalTotals);
  }

  public getIntervalTotalsPopulationLow(): boolean {
    return TestReportUtils.getIntervalTotalsPopulationLow(this.intervalTotals$.getValue());
  }

  public getIntervalTotalsSegmentLow(segmentId?: string): boolean {
    return TestReportUtils.getIntervalTotalsSegmentLow(this.availableSegments, this.intervalTotals$.getValue(), segmentId);
  }

  private _refreshChart(): void {
    this.switcher$.next(false);
    setTimeout(() => this.switcher$.next(true));
  }

  private _feedbackMapper(accumulatedFeedbacks: AccumulatedFeedback[]): void {
    // tslint:disable-next-line:no-unused-expression
    accumulatedFeedbacks &&
      accumulatedFeedbacks.map((accumulatedFeedback: AccumulatedFeedback) => {
        accumulatedFeedback.segment =
          this._segmentOptions$.getValue() && this._segmentOptions$.getValue().find(el => el.id === accumulatedFeedback.segmentID)?.value;
        accumulatedFeedback.gender =
          this._genderOptions$.getValue() && this._genderOptions$.getValue().find(el => el.id === accumulatedFeedback.genderId)?.value;
        return accumulatedFeedback;
      });
  }

  private _getOpenQuestionDataSetItem(feedback, accumulatedQuestionFeedbacks): void {
    feedback.answers = accumulatedQuestionFeedbacks?.filter(item => item.id === feedback.id);
  }

  private _getScaleQuestionDataSetItem(feedback, accumulatedScales): void {
    feedback.answers = accumulatedScales?.filter(item => item.id === feedback.id);
    Array.from(Array(8).keys()).forEach(num => {
      const obj = {
        index: num,
        value: Math.round(feedback.answers.find(item => item.answer === num)?.percent) || 0,
      };
      feedback.dataSet.push(obj);
    });
    const doNotKnow = feedback.dataSet.splice(0, 1)[0];
    feedback.dataSet.splice(feedback.dataSet.length, 0, doNotKnow);
  }

  private _getSingleQuestionDataSetItem(feedback, accumulatedSingles): void {
    feedback.answers = accumulatedSingles?.filter(item => item.questionId === feedback.id);
    feedback.answerType === AnswerCustomQuestionType.Default
      ? this._getSingleDefaultQuestionDataSetItem(feedback, accumulatedSingles)
      : this._getSingleGridQuestionDataSetItem(feedback);
  }

  private _getSingleDefaultQuestionDataSetItem(feedback, accumulatedSingles): void {
    feedback.rows?.forEach(item => {
      const obj = {
        value: Math.round(accumulatedSingles.find(ans => ans.answerId === item.id)?.percent) || 0,
        label: item.value,
        id: item.id,
        segmentId: null,
      };
      feedback.dataSet.push(obj);
      if (this.test.testType === TestType.BT && this._segmentOptions$.getValue()) {
        feedback.dataSet.push(
          ...this._segmentOptions$.getValue()?.map(segment => {
            return {
              value:
                Math.round(
                  accumulatedSingles
                    .find(ans => ans.answerId?.trim() === item.id)
                    ?.segmentAccumulatedQuestions.find(seg => seg.segmentId === segment.id)?.percent
                ) || 0,
              label: item.value,
              id: item.id,
              segmentId: segment.id,
            };
          })
        );
      }
    });
  }

  private _getSingleGridQuestionDataSetItem(feedback): void {
    feedback.rows?.forEach(item => {
      const obj = {
        value: 0,
        label: item.value,
        id: item.id,
        gridData: [],
        segmentData: [],
      };
      feedback.answers?.forEach(ans => {
        if (ans.subQuestionId === item.id) {
          const answerObj: BarGridData = {
            id: ans.answerId,
            label: feedback.columns.find(column => column.id === ans.answerId)?.value,
            value: ans.percent,
            index: feedback.columns.find(column => column.id === ans.answerId)?.position,
          };
          if (this.test.testType === TestType.BT) {
            obj.segmentData.push(this._setSegmentsAnswers(ans, feedback));
          }
          obj.gridData.push(answerObj);
        }
      });
      obj.gridData = sortBy(obj.gridData, ['index']).reverse();
      feedback.dataSet.push(obj);
    });
  }

  private _getMultiQuestionDataSetItem(feedback, accumulatedMulties): void {
    feedback.answers = accumulatedMulties?.filter(item => item.questionId === feedback.id);
    feedback.answerType === AnswerCustomQuestionType.Default
      ? this._getMultiDefaultQuestionDataSetItem(feedback, accumulatedMulties)
      : this._getMultiGridQuestionDataSetItem(feedback);
  }

  private _getMultiDefaultQuestionDataSetItem(feedback, accumulatedMulties): void {
    feedback.rows.forEach(item => {
      const obj = {
        value: Math.round(accumulatedMulties.find(ans => ans.answerId?.trim() === item.id)?.percent) || 0,
        label: item.value,
        id: item.id,
        segmentId: null,
      };
      feedback.dataSet.push(obj);
      if (this.test.testType === TestType.BT && this._segmentOptions$.getValue()) {
        feedback.dataSet.push(
          ...this._segmentOptions$.getValue()?.map(segment => {
            return {
              value:
                Math.round(
                  accumulatedMulties
                    .find(ans => ans.answerId?.trim() === item.id)
                    ?.segmentAccumulatedQuestions.find(seg => seg.segmentId === segment.id)?.percent
                ) || 0,
              label: item.value,
              id: item.id,
              segmentId: segment.id,
            };
          })
        );
      }
    });
    feedback.columns.forEach(col => {
      const colObj = {
        value: Math.round(accumulatedMulties.find(ans => ans.answerId === col.id)?.percent) || 0,
        label: col.value,
        isColumn: true,
      };
      feedback.dataSet.push(colObj);
    });
  }

  private _getMultiGridQuestionDataSetItem(feedback): void {
    feedback.rows.forEach((item, i) => {
      const obj = {
        value: 0,
        label: item.value,
        id: item.id,
        gridData: [],
        segmentData: [],
      };
      feedback.columns.forEach(col => {
        const ans = feedback.answers.find(answ => answ.subQuestionId === item.id && answ.answerId === col.id);
        const answerObj: BarGridData = {
          id: col.id,
          label: col.value,
          value: ans?.percent || 0,
          index: col.position,
        };
        if (this.test.testType === TestType.BT) {
          obj.segmentData.push(
            this._setSegmentsAnswers(
              { answerId: col.id, segmentAccumulatedQuestions: ans?.segmentAccumulatedQuestions || [] },
              feedback
            )
          );
        }
        obj.gridData.push(answerObj);
      });
      obj.gridData = sortBy(obj.gridData, ['index']);
      feedback.dataSet.push(obj);
    });
  }

  private _setAdditionalQuestionsDataForPDF(): void {
    /** Scale */
    if (this._additionalQuestionsDataSet[0]?.feedback.find(feedback => feedback.type === CustomQuestionType.Scale)) {
      const scaleQuestions = [];
      this._additionalQuestionsDataSet.forEach((concept: AdditionalQuestionsModel) => {
        const newModelScale = {
          label: concept.label,
          feedback: concept.feedback.filter(feedback => feedback.type === CustomQuestionType.Scale),
        };
        newModelScale.feedback.forEach(feedback => {
          const questionModel = {
            label: newModelScale.label,
            feedback,
          };
          scaleQuestions.push(questionModel);
        });
      });
      this.pdfScaledQuestionsDataSet$.next(scaleQuestions);
    }
    /** Single Choice */
    if (
      this._additionalQuestionsDataSet[0]?.feedback.find(
        feedback => feedback.type === CustomQuestionType.Single && feedback.answerType === AnswerCustomQuestionType.Default
      )
    ) {
      const singleQuestions = [];
      this._additionalQuestionsDataSet.forEach((concept: AdditionalQuestionsModel) => {
        const newModelScale = {
          label: concept.label,
          feedback: concept.feedback.filter(
            feedback => feedback.type === CustomQuestionType.Single && feedback.answerType === AnswerCustomQuestionType.Default
          ),
        };
        newModelScale.feedback.forEach(feedback => {
          const questionModel = {
            label: newModelScale.label,
            feedback,
          };
          singleQuestions.push(questionModel);
        });
      });
      this.pdfSingleQuestionsDataSet$.next(singleQuestions);
    }
    /** Multi Choice */
    if (
      this._additionalQuestionsDataSet[0]?.feedback.find(
        feedback => feedback.type === CustomQuestionType.Multi && feedback.answerType === AnswerCustomQuestionType.Default
      )
    ) {
      const miltiQuestions = [];
      this._additionalQuestionsDataSet.forEach((concept: AdditionalQuestionsModel) => {
        const newModelScale = {
          label: concept.label,
          feedback: concept.feedback.filter(
            feedback => feedback.type === CustomQuestionType.Multi && feedback.answerType === AnswerCustomQuestionType.Default
          ),
        };
        newModelScale.feedback.forEach(feedback => {
          const questionModel = {
            label: newModelScale.label,
            feedback,
          };
          miltiQuestions.push(questionModel);
        });
      });
      this.pdfMultiQuestionsDataSet$.next(miltiQuestions);
    }
    /** Single Grid Choice */
    if (
      this._additionalQuestionsDataSet[0]?.feedback.find(
        feedback => feedback.type === CustomQuestionType.Single && feedback.answerType === AnswerCustomQuestionType.Grid
      )
    ) {
      const singleGridQuestions = [];
      this._additionalQuestionsDataSet.forEach((concept: AdditionalQuestionsModel) => {
        const newModelScale = {
          label: concept.label,
          feedback: concept.feedback.filter(
            feedback => feedback.type === CustomQuestionType.Single && feedback.answerType === AnswerCustomQuestionType.Grid
          ),
        };
        singleGridQuestions.push(...TestReportUtils.sliceSingleGridQuestion({ ...newModelScale }));
      });
      this.pdfSingleGridQuestionsDataSet$.next(singleGridQuestions);
    }
    /** Multi Grid Choice */
    if (
      this._additionalQuestionsDataSet[0]?.feedback.find(
        feedback => feedback.type === CustomQuestionType.Multi && feedback.answerType === AnswerCustomQuestionType.Grid
      )
    ) {
      const singleGridQuestions = [];
      this._additionalQuestionsDataSet.forEach((concept: AdditionalQuestionsModel) => {
        const newModelScale = {
          label: concept.label,
          feedback: concept.feedback.filter(
            feedback => feedback.type === CustomQuestionType.Multi && feedback.answerType === AnswerCustomQuestionType.Grid
          ),
        };
        singleGridQuestions.push(...TestReportUtils.sliceSingleGridQuestion({ ...newModelScale }, newModelScale.feedback[0].image ? 4 : 6));
      });
      this.pdfMultiGridQuestionsDataSet$.next(singleGridQuestions);
    }
    this._additionalQuestionsDataSet = [];
  }

  private _setSegmentsAnswers(ans, feedback): { id: any; label: any; value: any; index: any; segmentId: string }[] {
    return this._segmentOptions$.getValue()?.map(segment => {
      return {
        id: ans.answerId,
        label: feedback.columns.find(column => column.id === ans.answerId).value,
        value: ans.segmentAccumulatedQuestions.find(seg => seg.segmentId === segment.id)?.percent || 0,
        index: feedback.columns.find(column => column.id === ans.answerId).position,
        segmentId: segment.id,
      };
    });
  }
}
