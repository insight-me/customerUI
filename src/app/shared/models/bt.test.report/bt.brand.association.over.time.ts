import {ListItem} from "../test.model";
import {LineChartDataSet} from "./line.chart.dataset";

export interface BtBrandAssociationOverTime {
  association: ListItem;
  dataset: LineChartDataSet[];
}
