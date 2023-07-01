import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BtReportStateService } from '../../bt.report.state.service';

@Component({
  selector: 'app-bt-associations',
  templateUrl: './bt-associations.component.html',
  styleUrls: ['./bt-associations.component.scss', '../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAssociationsComponent {
  constructor(public btRSS: BtReportStateService) {}

  public gridStyle(index): { [key: string]: string } {
    if (!this.btRSS.associationsExpandedCharts.has(index)) {
      return {};
    }
    return {
      'grid-area': this.getGridArea(index),
    };
  }

  private getGridArea(index: number): string {
    switch (index) {
      case 0:
        /*first-card row*/
        return '1/1/2/3';
      case 1:
        /*if true - second-card row, else first-card row*/
        return this.btRSS.associationsExpandedCharts.has(0) ? '2/1/3/3' : '1/1/2/3';
    }
  }
}
