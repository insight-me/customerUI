import { Component, OnInit } from '@angular/core';
import { KPITitle } from 'src/app/shared/models/bic.test.report/KPIModel';
import { BicReportStateService } from '../../bic/bic.report.state.service';
import { BtReportStateService } from '../../bt/bt.report.state.service';

@Component({
  selector: 'app-base-dashboard',
  template: '',
})
export class BaseDashboardComponent implements OnInit {
  public KPITitle = KPITitle;

  public service: BicReportStateService | BtReportStateService;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  public setService(service: BicReportStateService | BtReportStateService): void {
    this.service = service;
  }

  public toggleZoom(index: number): void {
    this.service.dashboardExpandedCharts.has(index)
      ? this.service.dashboardExpandedCharts.delete(index)
      : this.service.dashboardExpandedCharts.add(index);
  }

  public gridStyle(index): { [key: string]: string } {
    if (!this.service.dashboardExpandedCharts.has(index)) {
      return {};
    }
    return {
      'grid-area': this.getGridArea(index)
    };
  }

  private getGridArea(index: number): string {
    switch (index) {
      case 0:
        /*first-card row*/
        return '1/1/2/3';
      case 1:
        /*if true - second-card row, else first-card row*/
        return this.service.dashboardExpandedCharts.has(0) ? '2/1/3/3' : '1/1/2/3';
      case 2:
        /*if true - third-card row, else second-card row*/
        return (this.service.dashboardExpandedCharts.has(0) && this.service.dashboardExpandedCharts.has(1)) ? '3/1/4/3' : '2/1/3/3';
      case 3:
        /*fourth row*/
        if (this.service.dashboardExpandedCharts.size === 4) {
          return '4/1/5/3';
          /*third-card row*/
        } else if (this.service.dashboardExpandedCharts.size === 3 || this.service.dashboardExpandedCharts.has(2)) {
          return '3/1/4/3';
          /*second-card row*/
        } else {
          return '2/1/3/3';
        }
    }
  }

}
