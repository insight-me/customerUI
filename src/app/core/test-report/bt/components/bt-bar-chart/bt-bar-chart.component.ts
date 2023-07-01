import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, HostListener,
  Injector, Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { BaseChartComponent } from '../../../bic/components/base-chart/base-chart.component';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { BtStyleService } from '../../bt.style.service';
import {GroupedBarDataSet} from "../../../../../shared/models/bic.test.report/grouped.bar.data.set";
import {Observable, of, Subject, Subscription} from "rxjs";
import {debounceTime, tap} from "rxjs/operators";
import {ListItem} from "../../../../../shared/models/test.model";

@Component({
  selector: 'app-bt-bar-chart',
  templateUrl: './bt-bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtBarChartComponent extends BaseChartComponent<BarDataSetModel> implements AfterViewInit, OnChanges {
  @Input() public label: string;
  @Input() public secondColorSchema: boolean = false;
  @Input() public thirdColorSchema: boolean = false;
  @Input() public competitorsBrands: ListItem[] = [];
  public horizontalAxis: number[] = [];
  public benchmarks: number[] = [];
  public scale: number = 1;

  public subAxisWidth: Observable<string>;
  private subscription: Subscription = new Subscription();

  constructor(
    protected injector: Injector,
    public btStyle: BtStyleService,
  ) {
    super(injector);
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const {scrollWidth} = this.chartRef.nativeElement;
    this.subAxisWidth = of(scrollWidth ? scrollWidth + 'px' : '100%');
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && changes.dataSet.currentValue) {
      this.benchmarks = this.dataSet.filter(el => el.isOwn).map(el => el.value);
      this.resetData(this.dataSet);
    }
  }

  public barStyle({value, isOwn, id}: BarDataSetModel, index: number): {[key: string]: string} {
    let background;
    if (this.secondColorSchema) {
      background = isOwn || id === 'total' ? '#AFEBAB' : '#ADD9F4';
    } else {
      background = isOwn ? '#FFA56F' : '#B8B2EA';
    }
    return {
      height: (value || 1) / this.scale + '%',
      background,
      border: '1px solid #fff'
    }
  }

  private resetData(dataSet: BarDataSetModel[]): void {
    const maxValue = Math.max(...dataSet.map(({value}) => value)) || 100;
    const maxSubAxis = Math.ceil(maxValue / 10) * 10;
    let iteration = 5;
    if (maxSubAxis > 30) {
      iteration = 10;
    }
    if (maxSubAxis > 60) {
      iteration = 20;
    }
    this.scale = maxSubAxis / 100;
    this.horizontalAxis = [];
    for (let i = 0; i <= maxSubAxis; i += iteration) {
      this.horizontalAxis.push(i);
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
