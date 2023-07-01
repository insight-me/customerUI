import { BarDataSetModel } from './bar.data.set.model';
import { KPITitle } from './KPIModel';

export interface KPIWithGroupedBarDataSet {
  kpi: KPITitle;
  populationBarDataSet: GroupedBarDataSet;
  groupedBarDataSet: GroupedBarDataSet[];
  groupedBarDataSetPerPage?: GroupedBarDataSet[][];
  countConcepts: number;
  index?: number;
  total?: number;
}

export interface GroupedBarDataSet {
  brandId?: string;
  id: string;
  label: string;
  values: BarDataSetModel[];
}
