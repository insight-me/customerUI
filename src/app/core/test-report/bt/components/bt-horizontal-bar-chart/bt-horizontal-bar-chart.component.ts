import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GroupedBarDataSet} from "../../../../../shared/models/bic.test.report/grouped.bar.data.set";
import {BarDataSetModel} from "../../../../../shared/models/bic.test.report/bar.data.set.model";
import {TestReportUtils} from "../../../../../shared/utils/test.report.utils";
import {BtStyleService} from "../../bt.style.service";
import {InlineStyleModel} from "../../../../../shared/models/inline.style.model";

@Component({
  selector: 'app-bt-horizontal-bar-chart',
  templateUrl: './bt-horizontal-bar-chart.component.html',
  styleUrls: ['./bt-horizontal-bar-chart.component.scss']
})
export class BtHorizontalBarChartComponent implements OnInit, OnChanges {
  @Input() public dataSet: GroupedBarDataSet[];
  @Input() public pdfVersion = false;

  public style: {[key: string]: InlineStyleModel} = {
    footer: {
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    legend: {
      'font-size': '14px',
      'letter-spacing': '0',
      margin: '0 30px 10px 0',
      display: 'flex',
      'align-items': 'center',
      'font-family': 'GT Walsheim Pro Medium',
      'line-height': '150%',
    },
    icon: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      marginRight: '11px',
    }
  }

  public scale: number = 1;
  public axis: number[] = [];

  constructor(
    public btStyle: BtStyleService,
  ) { }

  ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSet && changes.dataSet.currentValue) {
      this.resetData()
    }
  }

  public barStyle(bar: BarDataSetModel, index: number): {[key: string]: string} {
    const background = TestReportUtils.getLineChartColor(index);
    const width = `${(bar.value) / this.scale}%`
    return {
      width,
      background,
      height: '27px',
      'border-radius': '0 5px 5px 0',
      'margin-bottom': '3px',
      'min-width': '50px',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'flex-end'
    };
  }

  public getBackground(index: number): string {
    return TestReportUtils.getLineChartColor(index);
  }

  private resetData(): void {
    const maxValue = Math.max(...this.dataSet.map(group => Math.max(...group.values.map(({value}) => value))));
    const maxSubAxis = Math.ceil(maxValue / 10) * 10 || 10;
    this.scale = maxSubAxis / 100;
    for (let i = 0; i <= maxSubAxis; i += 5) {
      this.axis.push(i);
    }
  }

}
