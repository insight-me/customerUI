import { TestConcept } from '../test.model';
import { AccumulatedBenefits, AccumulatedReasons } from './test.concept.result.model';

export interface ConceptBenefitsReasonsModel {
  concept: TestConcept;
  accumulatedData: AccumulatedBenefits[] | AccumulatedReasons[];
}
