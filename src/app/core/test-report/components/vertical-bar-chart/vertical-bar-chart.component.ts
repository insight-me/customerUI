import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BarDataSetModel } from '../../../../shared/models/bic.test.report/bar.data.set.model';
import { BaseChartComponent } from '../../bic/components/base-chart/base-chart.component';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { ChartType } from '../../../../shared/enums/bic.report.tab.type';
import { COLORS5, COLORS_FOR_SCALE, OVERALL_SCORE_VERTICAL_BAR_CHART_GRADIENT_COLORS } from '../../../../../assets/consts/consts';
import { sortBy, cloneDeep } from 'lodash';

export const BAR_WIDTH = 55;

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalBarChartComponent extends BaseChartComponent<BarDataSetModel> implements AfterViewInit, OnChanges {
  @Input() public benchmark: number;
  @Input() public title: string;
  @Input() public type: ChartType;
  @Input() public columnsData;
  @Input() public showDefaultLegend = false;
  @Input() public tooltipTexts: string[] = [];
  @Input() public tooltipType = '';
  @Input() public showSegments = false;

  @ViewChild('datasetContainerRef') private datasetContainerRef: ElementRef;
  @ViewChildren('datasetLabels') private datasetLabels: any;
  @ViewChild('benchmarkLabel') private benchmarkLabel: ElementRef;

  public horizontalAxis: number[] = [];
  public paginatedDataSet$: Observable<BarDataSetModel[]>;
  public ChartType = ChartType;
  public Math = Math;
  public noData = false;

  private pagingSource: Subject<void> = new Subject<void>();
  private zoomSource: Subject<boolean> = new Subject<boolean>();

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._orderDataByAscLabels();
    if (changes.benchmark && changes.benchmark.currentValue) {
      for (let i = 1; i <= 10; i++) {
        if (+this.benchmark === i * 10) {
          continue;
        }
        this.horizontalAxis.push(i);
      }
    }
    if (changes.dataSet && changes.dataSet.currentValue) {
      if (this.type === ChartType.Grid) {
        this.noData = this.dataSet[0].gridData.reduce((accum, val) => accum + val.value, 0) === 0;
      }
      this.total = this.dataSet.length;
      this.paginatedDataSet$ = this._getPaginatedDataSet();
    }
    this.cdr.markForCheck();
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this._setEntriesPerPage();
    this._setHorizontalAxis();
  }

  public resetLabels(): void {
    if (!this.type) {
      setTimeout(() => {
        this.datasetLabels._results.forEach(el => {
          const height = el?.nativeElement.offsetParent.offsetHeight - 20;
          this.renderer?.setStyle(el?.nativeElement, 'width', height + 'px');
        });

        const benchmarkHeight = this.benchmarkLabel?.nativeElement.offsetParent.offsetHeight - 20;
        this.renderer?.setStyle(this.benchmarkLabel?.nativeElement, 'width', benchmarkHeight + 'px');
      });
    }
  }

  public getBackground(index: number): string {
    if (this.type === ChartType.Scale) {
      return COLORS_FOR_SCALE[index];
    }
    return this.type === ChartType.Grid
      ? index === -1
        ? COLORS5[COLORS5.length - 1]
        : COLORS5[index]
      : OVERALL_SCORE_VERTICAL_BAR_CHART_GRADIENT_COLORS[index];
  }

  public back(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pagingSource.next();
    }
  }

  public forward(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pagingSource.next();
    }
  }

  public getB3B(): number {
    return this.dataSet
      .filter(data => data.index > 0 && data.index < 4)
      .map(data => data.value)
      .reduce((prev, next) => prev + next, 0);
  }

  public getT3B(): number {
    return this.dataSet
      .filter(data => data.index > 4 && data.index < 8)
      .map(data => data.value)
      .reduce((prev, next) => prev + next, 0);
  }

  public get totalPages(): number {
    return Math.ceil(this.total / this.entriesPerPage);
  }

  public zoomHandler(): void {
    this.zoomSource.next(true);
    setTimeout(() => {
      this.currentPage = 1;
      this._setEntriesPerPage();
      this.pagingSource.next();
    });
  }

  public showSubAxisLabel(axis: number): boolean {
    return axis % 2 === 0 && Math.floor(this.benchmark / 10) !== axis;
  }

  public getChartStyle(chart: BarDataSetModel, index: number): { [key: string]: string } {
    return {
      background: this.type === ChartType.Grid && this.noData ? 'none' : this.getBackground(index),
      border: this.type === ChartType.Scale && chart.index === 0 ? '1px solid #D6D6D6' : 'none',
      height: this.type === ChartType.Grid ? '100%' : (chart.value || 1) + '%',
    };
  }

  public getChartContainerStyle(): { [key: string]: string } {
    return {
      justifyContent: this.type ? (this.type === ChartType.Scale ? 'space-between' : 'space-around') : 'flex-start',
      margin: this.type === ChartType.Grid ? '0 165px' : '0 10px 0 40px',
    };
  }

  private _setEntriesPerPage(): void {
    if (!this.datasetContainerRef) {
      return;
    }
    this.entriesPerPage = Math.floor(this.datasetContainerRef.nativeElement.clientWidth / BAR_WIDTH);
  }

  private _setHorizontalAxis(): void {
    if (this.type) {
      for (let i = 1; i <= 10; i++) {
        if (+this.benchmark === i * 10) {
          continue;
        }
        this.horizontalAxis.push(i);
      }
    }
  }

  private _getPaginatedDataSet(): Observable<BarDataSetModel[]> {
    const pagingSource = this.pagingSource.asObservable().pipe(startWith(''), debounceTime(200));
    return merge(this.zoomSource.asObservable(), pagingSource).pipe(
      map((isZoomAction: boolean) => {
        if (isZoomAction) {
          return [];
        } else {
          const firstIndex = this.totalPages > 1 && this.currentPage > 1 ? (this.currentPage - 1) * this.entriesPerPage : 0;
          return this.dataSet.slice(firstIndex, firstIndex + this.entriesPerPage);
        }
      }),
      tap(() => this.resetLabels()),
    );
  }

  private _orderDataByAscLabels(): void {
      this.dataSet = sortBy(this.dataSet, [item => item.label?.toLowerCase()]);
  }
}
