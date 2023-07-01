import { BTBrand } from '../bt-test.model';
import { ITotalBrandResultModels } from './bt.test.result.model';

export interface BrandFunnelDatasetModel {
  brand: BTBrand;
  dataset: BrandFunnelDataset[];
}

export interface IBrandFunnelDataset {
  brand: BTBrand;
  dataset: INewBrandFunnelDatasetItem[];
}

export interface BrandFunnelDatasetModelItem {
  brand: BTBrand;
  topOfMindSpontaneousAwareness: number;
  totalSpontaneousAwareness: number;
  aidedAwareness: number;
  aidedAwarenessToConsideration: number;
  consideration: number;
  considerationToPreference: number;
  preference: number;
  aidedAwarenessToPenetration: number;
  penetration: number;
  segmentId: string;
  spontaneousAwareness?: number;
}

type omitedBrandFunnelDataSet = 'name' | 'associtians' | 'brandId' | 'segments'
export interface INewBrandFunnelDatasetItem extends Omit<ITotalBrandResultModels, omitedBrandFunnelDataSet> {
  segmentId: string;
  considerationToPreference: number;
  aidedAwarenessToPenetration: number;
  aidedAwarenessToConsideration: number;
}

export interface BrandFunnelDataset {
  topOfMindSpontaneousAwareness: number;
  totalSpontaneousAwareness: number;
  aidedAwareness: number;
  aidedAwarenessToConsideration: number;
  consideration: number;
  considerationToPreference: number;
  preference: number;
  aidedAwarenessToPenetration: number;
  penetration: number;
  segmentId: string;
  spontaneousAwareness?: number;
}
export type omitedBrandFunnelDataset = 'brandId' | 'intervalIndex' | 'timeInternal' | 'name' | 'segments' | 'associtians' | 'comercialRecognition';
