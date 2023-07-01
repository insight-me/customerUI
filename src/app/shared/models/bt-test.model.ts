import { TestType } from '../enums/product.id.type';
import { KPIModel } from './bic.test.report/KPIModel';
import { CustomQuestions } from './bic.test/bic.custom.questions.model';
import { RespondentRequirements, TestStatus } from './test.model';

export interface BTTest {
  brands: BTBrand[];
  btTestAssociations: BtTestAssociation[];
  companyId: string;
  currencyRate: number;
  customAssociations: BtCustomAssociation[];
  endDate: string | null | Date;
  id: string;
  isAdvertizing: boolean;
  isAgreeSign: boolean;
  isRecommendation: boolean;
  isEnterAdditionalQuestionStep: boolean;
  isDraft: boolean;
  isEnterKPIStep: boolean;
  orderId: null | string;
  penetrationInMonthes: number;
  priceOfTest: number;
  productId: string;
  requieredNumberRespondent: number;
  numberRespondents: number;
  respondentRequirements: null | RespondentRequirements;
  testDurationInMonthes: number;
  startDate: null | string | Date;
  testCurrency: string;
  testName: string;
  timeForAnswering: number;
  testKPIs: KPIModel[];
  status: TestStatus;
  testType: TestType;
  customQuestions: CustomQuestions[];
  sv: number
}

export interface BTBrand {
  id?: string;
  testId: string;
  image: string;
  imageData?: string;
  description: string;
  name: string;
  isOwn: boolean;
  imageHash: string;
  needRemove: boolean;
  color: string;
  isNew?: boolean;
}

export interface CategoryInvolvement {
  name: string;
  id: string;
  irLevel: string;
  isOther: boolean;
}

export interface SubCategoryInvolvement {
  name: string;
  id: string;
  involvementCategoryId?: string;
  position?: number;
}

export interface BtTestAssociation {
  id: string;
  text: string;
  type: number;
}

export interface BtCustomAssociation {
  created?: string | Date;
  id?: string;
  testId?: string;
  value: string;
  text?: string;
}
