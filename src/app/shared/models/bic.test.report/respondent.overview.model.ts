export interface RespondentOverviewModel {
  timePeriodForTesting: string;
  markets: string;
  nrOfRespondents: string;
  genders: string;
  age: string;
  segments: string;
  // purchaseUsageFrequency: string;
  segmentsPerCountries?: SegmentsPerCountries[];
  estimatedIR?: number;
  actualIR?: number;
  isActualIR?: boolean;
}

export interface SegmentsPerCountries {
  country: string;
  numberOfResp: string;
  segments: string[];
}
