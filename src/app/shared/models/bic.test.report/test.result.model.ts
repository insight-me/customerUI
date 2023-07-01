import { TestConceptResultModel } from './test.concept.result.model';

export interface TestResultModel {
  testID: string;
  companyID: string;
  testConceptResultModels: { [conceptId: string]: TestConceptResultModel };
  created: string;
  updated: string;
}

export interface LegendDataSet {
  values: string;
  index: number;
}
