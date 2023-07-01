import { TestConcept } from '../test.model';
import { AccumulatedLikes } from './test.concept.result.model';
import { SummaryDatasetModel } from './summary.dataset.model';

export interface ConsumerInsightModel {
  concept: TestConcept;
  accumulatedLikes: AccumulatedLikes;
  //for PDF
  summaryDatasetModel?: SummaryDatasetModel[];
}
