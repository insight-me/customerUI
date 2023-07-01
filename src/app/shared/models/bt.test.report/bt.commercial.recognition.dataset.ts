import {BTBrand} from "../bt-test.model";

export interface BtCommercialRecognitionDataset {
  brand: BTBrand;
  value: number;
  negative?: boolean
}
