import {BTBrand} from "../bt-test.model";
import {KPITitle} from "../bic.test.report/KPIModel";
import {LineChartDataSet} from "./line.chart.dataset";

export interface BtBrandsKpiLineChartDataset {
  brand: BTBrand;
  kpis: KpiSegmentDataSet[];
}

export interface KpiSegmentDataSet {
  kpi: KPITitle;
  id: string;
  dataset: LineChartDataSet[];
}
