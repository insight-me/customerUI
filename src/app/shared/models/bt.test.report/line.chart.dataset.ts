export interface LineChartDataSet {
  name: string;
  series?: SeriesModel[];
  nps?: number;
  isOwn?: boolean;
  color?: string;
  id?: string;
  segments?: any;
  total?: SeriesModel[];
  npsSeries?: SeriesModel[];
}

export interface SeriesModel {
  value: number;
  name: string | number | Date;
  segment?: string;
  nps?: number;
  totals?: number;
}
