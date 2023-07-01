import {BTBrand} from "../bt-test.model";
import {LineChartDataSet} from "./line.chart.dataset";

export interface BtBrandsLineChartDataSet {
  brand: BTBrand;
  dataset: LineChartDataSet[];
}
