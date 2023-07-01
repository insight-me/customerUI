import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandButtonComponent } from './expand-button/expand-button.component';
import { TreeMultiselectComponent } from './tree-multiselect/tree-multiselect.component';
import { SharedModule } from '../../../shared/modules/shared.module';
import { BaseReportComponent } from './base-report/base-report.component';
import { BaseContentComponent } from './base-content/base-content.component';
import { BaseDashboardComponent } from './base-dashboard/base-dashboard.component';
import { DemographyFilterComponent } from './demography-filter/demography-filter.component';
import { AdditionalQuestionsComponent } from './additional-questions/additional-questions.component';
import { MatMenuModule } from '@angular/material/menu';
import { CustomQuestionPreviewComponent } from './custom-question-preview/custom-question-preview.component';
import { AnswersTableComponent } from './answers-table/answers-table.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import { MultiGridChartComponent } from './multi-grid-chart/multi-grid-chart.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { CustomQuestionsFiltersComponent } from './custom-questions-filters/custom-questions-filters.component';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CustomQuestionErrorMessageComponent } from './custom-question-error-message/custom-question-error-message.component';
import { BaseCustomQuestionFiltersComponent } from './base-custom-question-filters/base-custom-question-filters.component';

const components = [
  AdditionalQuestionsComponent,
  AnswersTableComponent,
  BaseContentComponent,
  BaseDashboardComponent,
  BaseReportComponent,
  ChartLegendComponent,
  CustomQuestionPreviewComponent,
  DemographyFilterComponent,
  ExpandButtonComponent,
  MultiGridChartComponent,
  TreeMultiselectComponent,
  VerticalBarChartComponent,
  CustomQuestionsFiltersComponent,
  MultiSelectFilterComponent,
];

@NgModule({
  imports: [CommonModule, SharedModule, MatMenuModule, OverlayModule],
  exports: [...components],
  declarations: [...components, CustomQuestionErrorMessageComponent, BaseCustomQuestionFiltersComponent],
})
export class SharedReportComponentModule {}
