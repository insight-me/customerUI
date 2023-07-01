export interface BarDataSetModel {
  id?: string;
  label?: string;
  value: number;
  index?: number;
  isOwn?: boolean;
  gridData?: BarGridData[];
  gamma?: number;
  segmentId?: string;
}

export interface BarGridData {
  id: string;
  label: string;
  value: number;
  index: number;
}
