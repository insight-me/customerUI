import {KPITitle} from "./KPIModel";

export interface ConceptScorePerSegmentModel {
  id: string;
  label: string;
  segments: SegmentKpis[];
  benchmarks: ConceptBenchmark;
}

export interface SegmentKpis {
  id: string;
  label: string;
  kpis: SegmentKpisValues;
}

export interface SegmentKpisValues {
  [KPITitle.Likeability]: number;
  [KPITitle.Relevance]: number;
  [KPITitle.Trustworthiness]: number;
  [KPITitle.CurrentBrandLikeability]: number;
  [KPITitle.Uniqueness]: number;
  [KPITitle.PurchaseFrequency]: number;
  [KPITitle.PurchaseIntent]: number;
  [KPITitle.Brandfit]: number;
}

export interface ConceptBenchmark {
  [KPITitle.Likeability]: BenchmarkModel;
  [KPITitle.Relevance]: BenchmarkModel;
  [KPITitle.Trustworthiness]: BenchmarkModel;
  [KPITitle.CurrentBrandLikeability]: BenchmarkModel;
  [KPITitle.Uniqueness]: BenchmarkModel;
  [KPITitle.PurchaseFrequency]: BenchmarkModel;
  [KPITitle.PurchaseIntent]: BenchmarkModel;
  [KPITitle.Brandfit]: BenchmarkModel;
}

export interface BenchmarkModel {
  benchmark: number;
  total: number;
}

export interface ScorePerConceptModel {
  conceptName: string;
}
