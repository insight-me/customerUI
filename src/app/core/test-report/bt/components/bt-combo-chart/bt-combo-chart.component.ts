import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { COLORS_NPS } from '../../../../../../assets/consts/report.const';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { GlobalFilterService } from '../global-filter.service';

@Component({
  selector: 'app-bt-combo-chart',
  templateUrl: './bt-combo-chart.component.html',
  styleUrls: ['./bt-combo-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtComboChartComponent implements AfterViewInit, OnDestroy {
  @Input() public data: LineChartDataSet[] = [];
  @Input() public pdfVersion = false;

  public horizontalAxis: number[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, -10, -20, -30, -40, -50, -60, -70, -80, -90, -100];
  public Math = Math;
  public colorScheme = {
    domain: COLORS_NPS,
  };
  public chartContainerWidth = 0;
  public maxWidth = 'calc(100vw - 380px)';

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, private globalFilterService: GlobalFilterService) { }

  public ngAfterViewInit(): void {
    this._subscribeOnFilterOpen();
    setTimeout(() => {
      document.querySelectorAll('path.area').forEach(elem => {
        const width = (elem as SVGSVGElement).getBBox().width;
        this.chartContainerWidth = Math.max(this.chartContainerWidth, width);
      });
      this.cdr.markForCheck();
    }, 0);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public groupStyle(value: number): { [key: string]: string } {
    const style = {
      position: 'absolute',
      width: '20px',
      height: (value / 2 || 1) + '%',
      background: '#6395B4',
      left: '50%',
      top: '50.5%',
      borderRadius: '5px 5px 0 0',
      transform: undefined,
    };
    if (value < 0) {
      style.height = (Math.abs(value) / 2 || 1) + '%';
      style.borderRadius = '0 0 5px 5px';
    } else {
      style.transform = 'translateY(-99%)';
    }
    return style;
  }

  private _subscribeOnFilterOpen(): void {
    this.globalFilterService.isOpened$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      this.maxWidth = 'calc(100vw - ' + (val ? '380px)' : '150px)');
      this.cdr.markForCheck();
    });
  }
}
