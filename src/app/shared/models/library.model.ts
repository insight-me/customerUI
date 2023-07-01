import { SortType } from '../enums/sort.type';

export interface TableHeaders {
  name: string;
  sorting: boolean;
  filtering: boolean;
  headerId?: number;
  fieldName?: string;
  filterList?: string[];
}

export interface FilterModel {
  first: number;
  rows: number;
  includeDeleted: boolean;
  sortField: string;
  sortOrder: SortType;
  selectFields: string[];
  includeProperties: string[];
  distinctFields: string[];
  filterFields: string[];
  filterValues: string[];
  filterTypes: number[];
}
