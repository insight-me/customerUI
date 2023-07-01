import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { BtDashboardWidgetComponent } from '../bt-dashboard-widget/bt-dashboard-widget.component';
import { COLORS3 } from '../../../../../../assets/consts/consts';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';

@Component({
  selector: 'app-bt-associations-chart',
  templateUrl: './bt-associations-chart.component.html',
  styleUrls: ['./bt-associations-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAssociationsChartComponent
  extends BtDashboardWidgetComponent<LineChartDataSet>
  implements AfterViewInit, OnChanges
{
  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet) {
      this.refreshChart();
    }
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    this.refreshChart();
  }

  public get colorScheme(): string[] {
    return this.dataSet[0].color
      ? [...this.dataSet].map((item) => item.color)
      : COLORS3;
  }
}
