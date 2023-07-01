import {KPITitle} from "../bic.test.report/KPIModel";
import {LineChartDataSet} from "./line.chart.dataset";

export interface BtCompetitorsPerformanceOverTimeDataset {
  kpi: KPITitle;
  id: string;
  dataset: LineChartDataSet[];
}
