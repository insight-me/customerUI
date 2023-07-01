import { ListItem } from '../test.model';

export interface BtMultiselectFilter {
  filterName: string;
  isMulti: boolean;
  formControlName: string;
  options: ListItem[];
  setFirst?: boolean;
  isAll?: boolean;
  selected?: Record<string, boolean>;
  allLabel?: string;
}
