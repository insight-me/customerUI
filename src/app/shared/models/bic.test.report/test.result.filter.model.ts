import { FilterType } from '../../enums/filter.type';
import { SortType } from '../../enums/sort.type';

export interface TestResultFilterModel {
  first?: number;
  rows?: number;
  includeDeleted?: boolean;
  sortField?: string;
  sortOrder?: SortType;
  selectFields?: string[];
  includeProperties?: string[];
  distinctFields?: string[];
  filterFields?: string[];
  filterValues?: string[];
  filterTypes?: FilterType;
  purchaseFrequencyCategoryId?: string;
  concepts?: string[];
  segments?: string[];
  genderIds?: string[];
  age?: { min: number, max: number }[];
  countryIds?: string[];
  regions?: string[];
  purchaseFrequencyIds?: string[];
  purchaseInvolvementIds?: string[];
  brand?: string;
}

export interface AgeGroup {
  name: string;
  min: number;
  max: number;
  id: number;
}
