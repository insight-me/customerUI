export interface AssociationsScoreDataModel {
  displayedColumns: string[];
  dataSource: AssociationScoreDataSource[];
  pdfData?: AssociationScoreDataSource[][];
}

export interface AssociationScoreDataSource {
  gamma: number;
  assotiation: string;
  concept1?: number;
  concept2?: number;
  concept3?: number;
  concept4?: number;
  concept5?: number;
  concept6?: number;
  concept7?: number;
  concept8?: number;
  concept9?: number;
  concept10?: number;
}
