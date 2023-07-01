import { AccumulatedFeedback } from './test.concept.result.model';
import { BarDataSetModel } from './bar.data.set.model';
import { AnswersCustomQuestions, ColumnsCustomQuestions } from '../bic.test/bic.custom.questions.model';
import { TestType } from '../../enums/product.id.type';

export interface AdditionalQuestionsModel {
  id?: string;
  label: string;
  feedback: QuestionFeedback[];
  testType?: TestType;
}

export interface QuestionFeedback {
  id: string;
  label?: string;
  answers: AccumulatedFeedback[];
  answerType?: number;
  type?: number;
  tabName?: string;
  image?: string;
  numberOfResp?: number;
  dataSet?: BarDataSetModel [];
  rows?: AnswersCustomQuestions[];
  columns: ColumnsCustomQuestions[];
}
