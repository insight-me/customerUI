import {ListItem} from "../test.model";
import {BarDataSetModel} from "../bic.test.report/bar.data.set.model";

export interface BtAssociationsComparedToCompetitorsDataset {
  association: ListItem;
  dataset: BarDataSetModel[];
  segmentDataset: any;
}
