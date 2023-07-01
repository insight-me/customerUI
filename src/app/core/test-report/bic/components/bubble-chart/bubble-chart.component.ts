import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BubbleDataSetModel } from '../../../../../shared/models/bic.test.report/bubble.data.set.model';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { BaseChartComponent } from '../base-chart/base-chart.component';
import { OVERALL_SCORE_BUBBLE_CHART_COLORS } from 'src/assets/consts/consts';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleChartComponent
  extends BaseChartComponent<BubbleDataSetModel>
  implements AfterViewInit, OnChanges
{
  @Input() public xBenchmark: number;
  @Input() public yBenchmark: number;
  @Input() public xAxesLabel: string;
  @Input() public yAxesLabel: string;
  @Input() public showZoom: boolean = true;
  @Input() public showDefaultLegend: boolean = false;

  public uniqDataSet: BubbleDataSetModel[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._orderDataByAscLabels();
    this._checkConceptInSamePosition();
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  public getTooltipPosition(item: BubbleDataSetModel): {
    [key: string]: boolean;
  } {
    if (item.isCluster) {
      return { right: item.x < 50, left: item.x >= 50 };
    } else {
      return { ['top-right']: item.x < 50, ['top-left']: item.x >= 50 };
    }
  }

  public getTooltipSyles(item: BubbleDataSetModel): { [key: string]: string } {
    const countColumns = Math.ceil(item.clusterLabels.length / 5);
    return {
      ['grid-template-columns']: `repeat(${countColumns},1fr)`,
    };
  }

  public getItemStyle(item: BubbleDataSetModel): { [key: string]: string } {
    const itemStyle = {
      left: `${item.x}%`,
      bottom: `${item.y}%`,
      background: this.getBackground(item.index),
    };
    if (item.isCluster) {
      itemStyle['width'] = '60px';
      itemStyle['height'] = '60px';
      itemStyle.background = `conic-gradient(${this._compositionConicGradientBG(
        item
      )})`;
    }
    return itemStyle;
  }

  private _compositionConicGradientBG(bubble: BubbleDataSetModel): string {
    let result = '';
    const calculatedPrecent = 100 / bubble.clusterIndxs.length;
    bubble.clusterIndxs.forEach((clusterIndx, index) => {
      result += `${this.getBackground(clusterIndx)} ${
        calculatedPrecent * index
      }% ${calculatedPrecent * (index + 1)}%,`;
    });
    result = result.slice(0, -1);
    return result;
  }

  public getBackground(index: number): string {
    return OVERALL_SCORE_BUBBLE_CHART_COLORS[index];
  }

  public getPdfAxisStyle(
    item: BubbleDataSetModel,
    index: number
  ): { [key: string]: string } {
    const color = this.getBackground(index);
    return {
      width: `calc(${item.x}% + 15px)`,
      height: `calc(${item.y}% + 15px)`,
      left: '-15px',
      bottom: '-15px',
      borderTop: `1px solid ${color}`,
      borderRight: `1px solid ${color}`,
    };
  }

  public getSeparatorStyle(
    item: BubbleDataSetModel,
    index: number
  ): { [key: string]: string } {
    const rotate = Math.round(360 / item.clusterIndxs.length) * index;
    return {
      position: `absolute`,
      width: `2px`,
      height: `50%`,
      background: `#ffffff`,
      transform: `rotate(${rotate}deg) translate(0px, -15px)`,
    };
  }

  public isTopRow(item: BubbleDataSetModel, index: number): boolean {
    if (item.clusterLabels.length > 5) {
      return index < 2;
    } else {
      return index === 0;
    }
  }

  private _checkConceptInSamePosition(): void {
    const uniqBubbles: BubbleDataSetModel[] = [];
    this.dataSet?.forEach((data, index) => {
      data.index = index;
      if (!uniqBubbles.length) {
        uniqBubbles.push({ ...data });
        return;
      }
      const samePositionBubble = uniqBubbles.find(
        (uniqBubble) => uniqBubble.x === data.x && uniqBubble.y === data.y
      );
      if (samePositionBubble) {
        samePositionBubble.isCluster = true;
        samePositionBubble.clusterLabels = [
          ...(samePositionBubble.clusterLabels || [samePositionBubble.label]),
        ];
        samePositionBubble.clusterLabels.push(data.label);
        samePositionBubble.clusterIndxs = [
          ...(samePositionBubble.clusterIndxs || [samePositionBubble.index]),
        ];
        samePositionBubble.clusterIndxs.push(index);
      } else {
        uniqBubbles.push({ ...data });
      }
    });

    this.uniqDataSet = uniqBubbles;
  }

  private _orderDataByAscLabels(): void {
    this.dataSet = sortBy(this.dataSet, [(item) => item.label.toLowerCase()]);
  }
}
