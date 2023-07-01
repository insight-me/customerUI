import { TestConcept } from '../test.model';
import { TotalRelevanceType } from '../../enums/bic.report.relevance.type';

export interface TotalRelevanceModel {
  concept: TestConcept;
  dataSet: TotalRelevanceDataSetModel[];
  pdfReport?: | TotalRelevanceDataSetModel[][];
}

export interface TotalRelevanceDataSetModel {
  name: string;
  value: number;
  type: TotalRelevanceType;
}
