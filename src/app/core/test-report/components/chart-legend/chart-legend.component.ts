import { Component, Input } from '@angular/core';
import { GRADIRNT_COLORS, OVERALL_SCORE_VERTICAL_BAR_CHART_GRADIENT_COLORS } from '../../../../../assets/consts/consts';
import { LegendDataSet } from '../../../../shared/models/bic.test.report/test.result.model';
import { LegendTypeEnum } from '../../../../shared/enums/bic.report.purchase.type';

@Component({
  selector: 'app-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['../vertical-bar-chart/vertical-bar-chart.component.scss'],
})
export class ChartLegendComponent {
  @Input() public columnsData: LegendDataSet[];
  @Input() public legendType: number;

  public getBackground(index: number): string {
    if (this.legendType === LegendTypeEnum.KPIPerSegment) {
      return OVERALL_SCORE_VERTICAL_BAR_CHART_GRADIENT_COLORS[index];
    }
    return index === -1 ? GRADIRNT_COLORS[GRADIRNT_COLORS.length - 1] : GRADIRNT_COLORS[index];
  }
}
