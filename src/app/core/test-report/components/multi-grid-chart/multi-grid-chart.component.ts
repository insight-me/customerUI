import { Component, Input } from '@angular/core';
import { GRADIRNT_COLORS } from '../../../../../assets/consts/consts';

@Component({
  selector: 'app-multi-grid-chart',
  templateUrl: './multi-grid-chart.component.html',
  styleUrls: ['./multi-grid-chart.component.scss', '../vertical-bar-chart/vertical-bar-chart.component.scss'],
})
export class MultiGridChartComponent {
  @Input() public title: string;
  @Input() public dataSet: any;
  @Input() private isPurchase = false;
  public horizontalAxis: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public Math = Math;

  public getBackground(index: number): string {
    return index === -1 ? GRADIRNT_COLORS[GRADIRNT_COLORS.length - 1] : GRADIRNT_COLORS[this.isPurchase ? Math.abs(index - 7) : index];
  }
}
