//todo replace todo with models
export interface TestConceptResultModel {
  testID?: string;
  companyID?: string;
  testConceptId?: string;
  accumulatedBenefits?: AccumulatedBenefits[];
  accumulatedReaasons?: AccumulatedReasons[];
  accumulatedAssocitions?: AccumulatedAssociation[];
  accumulatedKPIs?: AccumulatedKPI[];
  accumulatedRelevances?: AccumulatedRelevance[];
  created: string;
  updated: string;
  answeredTimeInSeconds: number;
  accumulatedFeedbacks: AccumulatedFeedback[];
  accumulatedQuestionFeedbacks: AccumulatedFeedback[];
  relevanceGenPerc: number;
  purFreGenPerc: number;
  ovelallMood: number;
  relevanceKPIAnswer: number;
  gammaKoef: number;
  accumulatedLikes: AccumulatedLikes;
  accumulatedLIkeAnswers: AccumulatedFeedback[];
  accumulatedThinksAnswers: AccumulatedFeedback[];
  accumulatedScales: AccumulatedScales[];
  accumulatedSingles: AccumulatedScales[];
  accumulatedMulties: AccumulatedScales[];
  accumulatedPurchases: AccumulatedPurchases[];
  respondentCount: number;
  orRespondentCount: number;
}

export interface AccumulatedPurchases {
  count: number;
  percent: number;
  value: number;
}

export interface AccumulatedScales {
  answer?: number;
  answerId?: string;
  count: number;
  id: string;
  questionId?: string;
  originalPercent: number;
}

export interface AccumulatedBenefits {
  id: string;
  count: number;
  originalPercent: number;
  comparePercent: number;
  name?: string;

  higherThenAverageEdge?: boolean;
  lowerThenAverageEdge?: boolean;
  isHigher?: boolean;
}

export interface AccumulatedReasons {
  id: string;
  count: number;
  originalPercent: number;
  comparePercent: number;
  name?: string;

  higherThenAverageEdge?: boolean;
  lowerThenAverageEdge?: boolean;
  isHigher?: boolean;
}

export interface AccumulatedAssociation {
  associtionId?: string;
  count?: number;
  percent?: number;
  relevancePos?: number;
  relevanceNeg?: number;
  index?: number;
  label?: string; //for AssociationsScoreComponent
  gamma?: number;
}

export interface AccumulatedKPI {
  kpiId: string;
  populationCount: number;
  totalCount: number;
  totalPercent: number;
  populationPercent: number;
  totalCompare: number;
  populationCompare: number;
  accumulatedSegmentKPIs: AccumulatedSegmentKPI[];
}

export interface AccumulatedSegmentKPI {
  kpiId: string;
  segmentId: string;
  count: number;
  percent: number;
  compare: number;
}

export interface AccumulatedRelevance {
  relevanceId: string;
  count: number;
  percent: number;
  compare: number;
}

export interface AccumulatedFeedback {
  id: string;
  text: string;
  count: number;
  percent: number;
  mood: number;

  segmentID: string;
  segment: string;
  age: number;
  genderId: string;
  gender: string;
}

export interface AccumulatedLikes {
  likedWords: { [word: string]: number };
  dislikedWords: { [word: string]: number };
  likedImages: { [imageId: string]: number };
  dislikedImages: { [imageId: string]: number };
}
