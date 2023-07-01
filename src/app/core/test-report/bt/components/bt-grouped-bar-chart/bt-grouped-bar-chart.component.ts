import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BaseChartComponent } from '../../../bic/components/base-chart/base-chart.component';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { BtStyleService } from '../../bt.style.service';
import {TestReportUtils} from "../../../../../shared/utils/test.report.utils";
import {KPITitle} from "../../../../../shared/models/bic.test.report/KPIModel";
import {KPI_NAME} from "../../../../../../assets/consts/consts";

@Component({
  selector: 'app-bt-grouped-bar-chart',
  templateUrl: './bt-grouped-bar-chart.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtGroupedBarChartComponent extends BaseChartComponent<GroupedBarDataSet> implements AfterViewInit, OnChanges {
  public horizontalAxis: number[] = [];
  public scale: number = 1;

  constructor(
    protected injector: Injector,
    public btStyle: BtStyleService,
  ) {
    super(injector);
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && changes.dataSet.currentValue) {
      this.resetData(changes.dataSet.currentValue);
    }
  }

  public groupStyle(kpi: BarDataSetModel, index: number): {[key: string]: string} {
    const background = TestReportUtils.getLineChartColor(index);
    return {
      height: (kpi.value || 1) / this.scale + '%',
      background
    }
  }

  private resetData(dataSet: GroupedBarDataSet[]): void {
    const maxValue = Math.max(...dataSet.map(group => Math.max(...group.values.map(({value}) => value)))) || 1;
    const maxSubAxis = Math.ceil(maxValue / 10) * 10;
    this.scale = maxSubAxis / 100;
    for (let i = 0; i <= maxSubAxis; i += 5) {
      this.horizontalAxis.push(i);
    }
  }

  public getGroupLabel(kpi: string): string {
    return KPI_NAME[kpi];
  }

  public getColor(index: number): string {
    return TestReportUtils.getLineChartColor(index);
  }
}
