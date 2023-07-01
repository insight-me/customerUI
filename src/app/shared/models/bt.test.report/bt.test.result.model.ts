import { AccumulatedFeedback, AccumulatedScales } from '../bic.test.report/test.concept.result.model';

export interface BtTestResultModel {
  testID: string;
  companyID: string;
  created: string;
  updated: string;
  brandResultModels: BrandResultModels[];
  noAnyComercialRecognition: {
    [key: number]: number;
  };
  intervalResultModels: Record<string, IntervalResultModels>;
  intervalTotals: Record<number, IntervalTotalItem>;
  recomendations: Recomendations[];
  totalBrandResultModels: ITotalBrandResultModels[];
  accumulatedScales: AccumulatedScales[];
  accumulatedSingles: AccumulatedScales[];
  accumulatedMulties: AccumulatedScales[];
  accumulatedFeedbacks: AccumulatedFeedback[];
  // TODO Fix typing
  customComercialRecognition: any;
  testSegments: { count: number, id: string }
}

export interface ITotalBrandResultModels {
  accumulatedConsiderations: string[];
  aidedAwareness: number;
  associtians: Association[];
  brandId: string;
  considerations: number;
  name: string;
  penetrations: number;
  preferences: number;
  recomendations: Recomendations[]
  segments: SegmentAccumulatedModel[];
  spontaneousAwareness: number;
  topSpontaneousAwareness: number;
}

export type IntervalTotals = Record<number, IntervalTotalItem>;

export interface IntervalTotalItem {
  popilationCount: number;
  segmentTotals: Record<string, number>;
  totalRespondents: number;
}

export interface IntervalResultModels {
  accumulatedFeedbacks: AccumulatedFeedback[];
  accumulatedScales: AccumulatedScales[];
  accumulatedSingles: AccumulatedScales[];
  accumulatedMulties: AccumulatedScales[];
  interval: number;
  timeInternal: number;
}

export interface IntervalResultModelsCustomQuestions {
  accumulatedFeedbacks: AccumulatedFeedback[];
  accumulatedScales: AccumulatedScales[];
  accumulatedSingles: AccumulatedScales[];
  accumulatedMulties: AccumulatedScales[];
  accumulatedLIkeAnswers?: AccumulatedFeedback[];
  accumulatedThinksAnswers?: AccumulatedFeedback[];
  accumulatedQuestionFeedbacks?: AccumulatedFeedback[];
}

export interface Recomendations {
  brandId: string;
  detractorsPercent: number;
  nps: number;
  passivesPercent: number;
  promotersPercent: number;
  total: number;
  segmentRecomendations: Recomendations[];
  segmentId?: string;
}

export interface BrandResultModels {
  accumulatedConsiderations: string[];
  spontaneousAwareness: number;
  topSpontaneousAwareness: number;
  aidedAwareness: number;
  considerations: number;
  preferences: number;
  penetrations: number;
  brandId: string;
  intervalIndex: number;
  timeInternal: number;
  name: string;
  segments: SegmentAccumulatedModel[];
  associtians: Association[];
  comercialRecognition: number;
  toggleAidedAwareness: number;
  toggleConsiderations;
  togglePenetrations: number;
  togglePreferences: number;
}

export interface SegmentAccumulatedModel {
  comercialRecognition: number;
  accumulatedConsiderations: string[];
  spontaneousAwareness: number;
  topSpontaneousAwareness: number;
  aidedAwareness: number;
  considerations: number;
  preferences: number;
  penetrations: number;
  segmentId: string;
  segmentAccumulatedAccocition: SegmentAccumulatedAssociation[];
}

export interface Association {
  associtionId: string;
  count: number;
  index: number;
  percent: number;
  relevanceNeg: number;
  relevancePos: number;
}

export interface SegmentAccumulatedAssociation {
  associtionId: string;
  count: number;
  index: number;
  percent: number;
  segmentId: string;
}
