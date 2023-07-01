export interface HighlightTag {
  indices: {
    start: number;
    end: number;
  };
  cssClass?: string;
  improvements?: any[];
  data?: any;
}
