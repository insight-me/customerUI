import {
  AnswerCustomQuestionType,
  CustomQuestionType,
  OrderCustomQuestionType,
} from '../../enums/bic.custom-questions.type';

export interface CustomQuestions {
  id: string;
  value: string;
  type: CustomQuestionType;
  answerType: AnswerCustomQuestionType;
  answerOrderType: OrderCustomQuestionType;
  columnOrderType: OrderCustomQuestionType;
  imageBase: string;
  image: string;
  minValue: number;
  maxValue: number;
  answers: AnswersCustomQuestions[];
  columns: ColumnsCustomQuestions[];
  isDontKnowOption: boolean;
}

export interface AnswersCustomQuestions {
  id?: string;
  position: number;
  value: string;
  isApproved?: boolean;
  subCategoryId?: string;
}

export interface ColumnsCustomQuestions {
  id?: string;
  position: number;
  value: string;
}

export interface CustomQuestionsScreening {
  id: string;
  value: string;
  type: CustomQuestionType;
  answerType: AnswerCustomQuestionType;
  answerOrderType: OrderCustomQuestionType;
  columnOrderType: OrderCustomQuestionType;
  answers: AnswersCustomQuestions[];
  columns: ColumnsCustomQuestions[];
  approveAnswers: ApproveAnswers[];
  isDontKnowOption: boolean;
}

export interface ApproveAnswers {
  answerPosition: number;
  answerColPosition: number;
}
