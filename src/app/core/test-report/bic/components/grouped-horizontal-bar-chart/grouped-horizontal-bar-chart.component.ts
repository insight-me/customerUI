import { Component, Input } from '@angular/core';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';

@Component({
  selector: 'app-grouped-horizontal-bar-chart',
  templateUrl: './grouped-horizontal-bar-chart.component.html',
  styleUrls: ['./grouped-horizontal-bar-chart.component.scss']
})
export class GroupedHorizontalBarChartComponent {
  @Input() public dataSet: GroupedBarDataSet[];

  public barStyle(bar: BarDataSetModel, index: number): {[key: string]: string} {
    const background = TestReportUtils.getColor(index, true);
    const width = `${bar.value}%`;
    return {
      width,
      background
    };
  }

}
