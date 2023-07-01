import { TestConcept } from '../test.model';
import { AccumulatedAssociation } from './test.concept.result.model';

export interface AssociationsPerConceptModel {
  label: string;
  id: string;
  associations: AccumulatedAssociation[]
}
