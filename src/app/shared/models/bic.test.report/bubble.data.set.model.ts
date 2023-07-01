export interface BubbleDataSetModel {
  x: number;
  y: number;
  id: string;
  label: string;
  index?: number;
  isCluster?: boolean;
  clusterLabels?: string[];
  clusterIndxs?: number[];
}
