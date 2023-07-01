import { CategoryScreening, CategoryScreeningType } from '../enums/category-screening.type';
import { TestType } from '../enums/product.id.type';
import { KPIModel } from './bic.test.report/KPIModel';
import {
  AnswersCustomQuestions,
  ColumnsCustomQuestions,
  CustomQuestions,
  CustomQuestionsScreening
} from './bic.test/bic.custom.questions.model';
import { Segment } from './test-creation.model';

export interface Test {
  actualIR: number;
  productId: string;
  benefits: ListItem[];
  companyId: string;
  consumerInsight: string;
  customAssociations: ListItem[];
  customQuestions: CustomQuestions[];
  id: string;
  imageLikesEnabled: boolean;
  openFeedback: boolean;
  reasons: ListItem[];
  respondentRequirements: RespondentRequirements;
  testName: string;
  timeForAnswering: number;
  wordsLikesEnabled: boolean;
  testAssociations: Association[];
  testKPIs: KPIModel[];
  priceOfTest: number;
  feedbackLike: boolean;
  feedbackThink: boolean;
  orderId: string;
  testConcepts: TestConcept[];
  concepts: TestConcept[];
  testConceptRelevance: boolean;
  purchaseFrequencyEnabled: boolean;
  currencyRate?: number;
  testCurrency?: string;
  isEnterKPIStep?: boolean;
  isEnterAdditionalQuestionStep?: boolean;
  endDate?: string;
  numberRespondents?: number;
  requieredNumberRespondent?: number;
  startDate?: string;
  status?: TestStatus;
  isDraft?: boolean;
  estimatedIR?: number;
  actualTimeForAnswering: number;
  testType: TestType;
  sv: number;
}

export interface TestConcept {
  id?: string;
  conceptName?: string;
  consumerInsight?: string;
  moodboard?: MoodBoard;
  benefits?: ListItem[];
  reasons?: ListItem[];
}

export interface RespondentRequirements {
  minAge?: number;
  maxAge?: number;
  countries?: Country[];
  genders?: ListItem[];
  segments?: Segment[];
  customSegments?: Segment[];
  customInvolvements: Involment[];
  subdivisions?: Subdivision[];
  isSegmentation?: boolean;
  isCustomSegmentation: boolean;
  involvementCategoryId: string;
  involvements: Involment[];
  involvementId: string;
  customCategory: CustomCategory;
  categoryIRs: CustomCategoryIR[];
  categoryDescription: string;
  allSegments?: boolean;
  respondentRequirementSegmentCounts?: SegmentRespondent[];
  categoryScreening: CategoryScreening;
  categoryScreeningType: CategoryScreeningType;
  customCategoryScreens: CustomQuestionsScreening[];
}

export interface Involment {
  id: string;
  value?: string;
  purchaseFrequenciesIds: string[];
  position?: number;
}

export interface CustomCategory {
  id?: string;
  categoryName: string;
}

export interface CustomCategoryIR {
  id?: string;
  countryId: string;
  ir: number;
}

export interface ListItem {
  id?: string;
  value: string;
}

export interface IAgeGroups {
  id: string;
  minValue: number;
  maxValue: number;
}

export interface AdditionalQuestionListItem {
  id: string;
  value: string;
  type: number;
  answerType: number;
  image?: string;
  answers: AnswersCustomQuestions[];
  columns: ColumnsCustomQuestions[];
}

export interface Statement {
  id: string;
  isRequired: boolean;
  question: string;
  title: string;
  type: number;
}

export interface Association {
  id: string;
  text: string;
  type: number;
  name?: string;
  value?: string;
}

export interface PriceAndTime {
  id: string;
  priceInCent: number;
  timeInSeconds: number;
  type: number;
}

export interface QuickTest {
  id: string;
  productName: TestName;
  orderDate?: string;
  completionDate?: string;
  status: TestStatus;
  answeredNumber: number;
  orderedNumber: number;
  report?: string;
  testName: string;
  passesCount: number;
  passesPercent: number;
  testType: TestType;
}

export interface LibraryTest {
  answeredNumber: number;
  id: string;
  orderedNumber: number;
  paymentStatus: number;
  productId: string;
  productName: TestName;
  report: null;
  testName: string;
  status: number;
  passesCount: number;
  endDate: string;
  publishDate: string;
  resultDate: string;
  startDate: string;
  passesPercent: number;
  testType: TestType;
}

export interface Countries {
  countryCode?: string;
  countryName?: string;
  id: string;
  population: number;
  subdivisions: Subdivision[];
}

export interface Subdivision {
  id: string;
  countryId?: string;
  populationPercent?: number;
  name?: string;
  value: string;
  nsid: number;
}

export enum TestName {
  BIC = 'Brand concept test',
  BT = 'Brand tracker',
}

export enum TestStatus {
  Draft = 0,
  Ongoing = 1,
  Finished = 2,
  Pending = 3,
  StartFailed = 4,
}

export enum AssociationType {
  Default = 0,
  Additional = 1,
  Recommended = 2,
}

export enum StatementType {
  Default = 0,
  Standard = 1,
  Recommended = 2,
  Additional = 3,
}

export enum StatementNameType {
  Default = 'Default',
  Standard = 'always included',
  Recommended = 'Recommended',
  Additional = 'Additional',
}

export enum SegmentLabel {
  Default = 'respondents.segment',
  All = 'report.All segments',
}

export enum RegionsLabel {
  Default = 'respondents.choose-region',
  All = 'respondents.all-selected-regions',
}

export enum SubcategoriesLabel {
  Default = 'respondents.Choose subcategories',
  One = 'BIC.1 sub-category selected',
}

export enum DefaultPurchaseInvolvements {
  Default = 'Often',
}

export enum TestSteps {
  Five = '5',
  One = '1',
}

export interface Country {
  id: string;
  value: string;
  respondentCount: number;
  populationCount: number;
  code: string;
}

export interface SegmentRespondent {
  segmentId: string;
  respondentRequirementCountryId: string;
  countryId: string;
  respondentCount: number;
  respondentRequirementCountry: any;
}

export interface MoodBoard {
  id?: string;
  items?: MoodBoardItem[];
  template?: number;
  testConceptId?: string;
}

export interface MoodBoardItem {
  id: string;
  itemData: MoodBoardItemData;
  moodboardId: string;
  path: string;
  position: number;
  likes: number; // for ConceptMoodBoardComponent
  dislikes: number; // for ConceptMoodBoardComponent
}

export interface MoodBoardItemData {
  itemHeight: number;
  itemPositionX: number;
  itemPositionY: number;
  itemWidth: number;
}

export interface CreateTest {
  testName: string;
  productId: string;
}

export interface CalcTestData {
  testId: string;
  time: number;
  gendersCount: number;
  minAge: number;
  maxAge: number;
  purchaiseFrequenciesCount?: number;
  purchaiseInvolvementsCount?: number;
  isCustomSegmentation?: boolean;
  companyId: string;
  segmentsCount?: number;
  countriesSubdivisionsCount: CountriesSubdivisionsCount[];
  startDate: string | Date;
  endDate: string | Date;
}

export interface CountriesSubdivisionsCount {
  countryId: string;
  subdivisionsCount?: number;
  respondentCount: number;
  populationCount?: number;
  segments?: CountrySegmentsCount[];
}

export interface CountrySegmentsCount {
  segmentId: string;
  respondentCount: number;
}
