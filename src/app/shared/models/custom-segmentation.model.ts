export interface CustomSegment {
  id?: string;
  displayText: string;
  constant: number;
  ir: number;
  isEnabled?: boolean;
}

export interface SegmentQuestion {
  id?: string;
  displayText: string;
  group?: number;
  minValue: number;
  maxValue: number;
}

export interface SegmentCoefficients {
  id?: string;
  customSegmentId: string;
  customSegmentationQuestionId: string;
  value: number;
}

export interface UpsetSegments {
  segments: CustomSegment[];
}

export interface UpsetSegmentationQuestions {
  questions: SegmentQuestion[];
}

export interface UpsertCustomSegmentCoefficients {
  coefficients: SegmentCoefficients[];
}

export interface CustomSegments {
  segments: CustomSegment[];
  questions: SegmentQuestion[];
  coefficients: SegmentCoefficients[];
  minValue: number;
  maxValue: number;
}

export interface MySegmentsList {
  displayText: string;
  constant?: number;
  ir?: number;
  count: number;
  minValue?: number;
  maxValue?: number;
}

export interface CustomSegmentation {
  segments: CustomSegment[];
  questions: SegmentQuestion[];
  coefficients: SegmentCoefficients[];
  minValue: number;
  maxValue: number;
}
