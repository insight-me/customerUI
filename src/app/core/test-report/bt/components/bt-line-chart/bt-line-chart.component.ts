import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,

  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as shape from 'd3-shape';
import { asyncScheduler } from 'rxjs';
import { tap } from 'rxjs/operators';
import { COLORS3 } from '../../../../../../assets/consts/consts';
import { LineChartDataSet } from '../../../../../shared/models/bt.test.report/line.chart.dataset';
import { GlobalFilterService } from '../global-filter.service';


@UntilDestroy()
@Component({
  selector: 'app-bt-line-chart',
  templateUrl: './bt-line-chart.component.html',
  styleUrls: ['./bt-line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BtLineChartComponent implements OnInit {
  @Input() public dataSet: LineChartDataSet[];
  @Input() public pdfVersion = false;
  @Input() public colorScheme = {
    domain: COLORS3,
  };
  public yAxisTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  public curve = shape.curveCardinal.tension(0.7);
  public isOpening = false;

  constructor(private _globalFiltersService: GlobalFilterService, private _cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.subscribeOnMenu();
  }

  public yAxisTickFormatting = (value: number) => {
    return value && (value / 10) % 2 === 0 ? value + '%' : '';
  }

  private subscribeOnMenu(): void {
    this._globalFiltersService.isOpened$.pipe(
      tap(() => {
        asyncScheduler.schedule(() => {
          this.isOpening = true;
          this._cdRef.markForCheck();
        }, 0);

        asyncScheduler.schedule(() => {
          this.isOpening = false;
          this._cdRef.markForCheck();
        }, 600);
      }),
      untilDestroyed(this)
    )
      .subscribe();
  }
}
