import { KPITitle } from '../bic.test.report/KPIModel';
import { BTBrand } from "../bt-test.model";
import { BrandResultModels } from "./bt.test.result.model";

export interface BtHealthOverviewDatasetModel {
  kpi: KPITitle;
  value: number;
  difference: KpiDifference;
}

export enum KpiDifference {
  Same = 0,
  Improved = 1,
  Lower = 2
}

export interface BtHealthOverviewDataset {
  brand: BTBrand;
  currentIntervalBrandResultModels: BrandResultModels;
  previousIntervalBrandResultModels: BrandResultModels;
}
