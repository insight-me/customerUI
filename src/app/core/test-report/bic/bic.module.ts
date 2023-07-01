import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { SharedReportComponentModule } from '../components/shared.report.component.module';
import { AssociationPerConceptImportanceComponent } from './components/association-per-concept-importance/association-per-concept-importance.component';
import { AssociationPerConceptComponent } from './components/association-per-concept/association-per-concept.component';
import { AssociationsScoreComponent } from './components/associations-score/associations-score.component';
import { AssociationsComponent } from './components/associations/associations.component';
import { BaseChartComponent } from './components/base-chart/base-chart.component';
import { BicGlobalFilterComponent } from './components/bic-global-filter/bic-global-filter.component';
import { BicLocalFiltersComponent } from './components/bic-local-filters/bic-local-filters.component';
import { BicReportComponent } from './components/bic-report/bic-report.component';
import { BrandAndBusinessKpisComponent } from './components/brand-and-business-kpis/brand-and-business-kpis.component';
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component';
import { ConceptDefinitionsComponent } from './components/concept-definitions/concept-definitions.component';
import { ConceptMoodBoardComponent } from './components/concept-mood-board/concept-mood-board.component';
import { ConceptOverviewComponent } from './components/concept-overview/concept-overview.component';
import { ConceptRespondTableComponent } from './components/concept-respond-table/concept-respond-table.component';
import { ConceptsFilterComponent } from './components/concepts-filter/concepts-filter.component';
import { ConceptsOverviewComponent } from './components/concepts-overview/concepts-overview.component';
import { ConsumerInsightSummaryComponent } from './components/consumer-insight-summary/consumer-insight-summary.component';
import { ConsumerInsightTextareaComponent } from './components/consumer-insight-textarea/consumer-insight-textarea.component';
import { ConsumerInsightWordcloudComponent } from './components/consumer-insight-wordcloud/consumer-insight-wordcloud.component';
import { DashboardPurchaseIntentComponent } from './components/dashboard-purchase-intent/dashboard-purchase-intent.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExportContainerComponent } from './components/export-container/export-container.component';
import { ExportReportComponent } from './components/export-report/export-report.component';
import { GroupedHorizontalBarChartComponent } from './components/grouped-horizontal-bar-chart/grouped-horizontal-bar-chart.component';
import { GroupedVerticalBarChartComponent } from './components/grouped-vertical-bar-chart/grouped-vertical-bar-chart.component';
import { KpiPurchaseFrequancyComponent } from './components/kpi-purchase-frequancy/kpi-purchase-frequancy.component';
import { KpiScorePerConceptComponent } from './components/kpi-score-per-concept/kpi-score-per-concept.component';
import { KpisScorePerSegmentComponent } from './components/kpis-score-per-segment/kpis-score-per-segment.component';
import { MoodboardLikesComponent } from './components/moodboard-likes/moodboard-likes.component';
import { OveralScoreComponent } from './components/overal-score/overal-score.component';
import { QuestionsFeedbackItemComponent } from './components/questions-feedback-item/questions-feedback-item.component';
import { QuestionsFeedbackComponent } from './components/questions-feedback/questions-feedback.component';
import { ReportContentComponent } from './components/report-content/report-content.component';
import { RespondentOverviewComponent } from './components/respondent-overview/respondent-overview.component';
import { RTBLocalFiltersComponent } from './components/rtb-local-filters/rtb-local-filters.component';
import { ScoreAndImportanceTableComponent } from './components/score-and-importance-table/score-and-importance-table.component';
import { ScorePerSegmentComponent } from './components/score-per-segment/score-per-segment.component';
import { SummaryTableComponent } from './components/summary-table/summary-table.component';
import { TotalRelevanceComponent } from './components/total-relevance/total-relevance.component';
import { WordsLikesDislikesComponent } from './components/words-likes-dislikes/words-likes-dislikes.component';

const components = [
  BicReportComponent,
  ConceptsFilterComponent,
  ReportContentComponent,
  DashboardComponent,
  RespondentOverviewComponent,
  ConceptDefinitionsComponent,
  BrandAndBusinessKpisComponent,
  AssociationsComponent,
  BubbleChartComponent,
  BaseChartComponent,
  ConsumerInsightTextareaComponent,
  ConsumerInsightWordcloudComponent,
  ConsumerInsightSummaryComponent,
  ConceptRespondTableComponent,
  ConceptMoodBoardComponent,
  GroupedVerticalBarChartComponent,
  ExportContainerComponent,
  ScorePerSegmentComponent,
  GroupedHorizontalBarChartComponent,
  AssociationsScoreComponent,
  QuestionsFeedbackComponent,
  QuestionsFeedbackItemComponent,
  SummaryTableComponent,
  ConceptOverviewComponent,
  ConceptsOverviewComponent,
  ExportReportComponent,
  TotalRelevanceComponent,
  MoodboardLikesComponent,
  OveralScoreComponent,
  BicLocalFiltersComponent,
  DashboardPurchaseIntentComponent,
  KpisScorePerSegmentComponent,
  BicGlobalFilterComponent,
  KpiPurchaseFrequancyComponent,
  KpiScorePerConceptComponent,
  AssociationPerConceptComponent,
  AssociationPerConceptImportanceComponent,
  ScoreAndImportanceTableComponent,
];

const routes: Routes = [
  {
    path: '',
    component: BicReportComponent,
  },
];

@NgModule({
  declarations: [
    ...components,
    RTBLocalFiltersComponent,
    WordsLikesDislikesComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    SharedComponentsModule,
    SharedReportComponentModule,
    TagCloudModule,
    SwiperModule,
    MatMenuModule,
    AngularSvgIconModule
  ],
  exports: [...components],
})
export class BicModule { }
