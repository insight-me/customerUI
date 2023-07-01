import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BaseChartComponent } from '../base-chart/base-chart.component';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import {
  KPITitle,
  KPITooltips,
} from 'src/app/shared/models/bic.test.report/KPIModel';
import { BicReportStateService } from '../../bic.report.state.service';

@Component({
  selector: 'app-grouped-vertical-bar-chart',
  templateUrl: './grouped-vertical-bar-chart.component.html',
  styleUrls: [
    './grouped-vertical-bar-chart.component.scss',
    '../concept-definitions/concept-definitions.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedVerticalBarChartComponent
  extends BaseChartComponent<GroupedBarDataSet>
  implements AfterViewInit, OnChanges
{
  @Input() public benchmark: number;
  @Input() public title: string;
  @Input() public populationBarDataSet: GroupedBarDataSet;
  @Input() public pdfVersion: boolean = false;
  @Input() public kpiFilters: KPITitle[];
  @Input() public selectedKPI: KPITitle;
  @Input() public tooltipType = '';
  @Input() public isFirstBarChart: boolean;

  @Output() onChangedKPI = new EventEmitter<string>();

  public isChooseConceptActive = false;
  horizontalAxis: number[] = [];
  allSelected: boolean = true;

  constructor(
    protected injector: Injector,
    public changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.benchmark) {
      for (let i = 0; i <= 10; i++) {
        if (+this.benchmark === i * 10) {
          continue;
        }
        this.horizontalAxis.push(i);
      }
    }
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.changeDetectionRef.detectChanges();
  }

  public showSubAxisLabel(axis: number): boolean {
    return Math.floor(this.benchmark / 10) !== axis;
  }

  public showConcepts(): void {
    this.isChooseConceptActive = !this.isChooseConceptActive;
  }

  public totalStyle(
    conceptTotal: BarDataSetModel,
    index: number
  ): { [key: string]: string } {
    const color = TestReportUtils.getColor(index);
    const background = `linear-gradient(180deg, ${color}80 0%, ${color}4d 100%)`;
    return {
      height: (conceptTotal.value || 1) + '%',
      background,
      border: `1px solid ${color}`,
    };
  }

  public groupStyle(
    concept: BarDataSetModel,
    index: number
  ): { [key: string]: string } {
    const color = TestReportUtils.getColor(index);
    const background = `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`;
    return {
      height: (concept.value || 1) + '%',
      background,
    };
  }

  public selectedFilter(filter: KPITitle, event: Event): void {
    event?.stopPropagation();
    this.onChangedKPI.emit(filter);
  }

  public getTooltipTexts(): string[] {
    return [KPITooltips[this.selectedKPI]];
  }
}
