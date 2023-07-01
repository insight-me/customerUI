import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharedReportComponentModule } from '../components/shared.report.component.module';
import { TestStateService } from '../test.state.service';
import { SharedModule } from './../../../shared/modules/shared.module';
import { BaseLocalFiltersComponent } from './components/base-local-filters/base-local-filters.component';
import { BrandHealthOverviewComponent } from './components/brand-health-overview/brand-health-overview.component';
import { BrandPerformanceOverTimeComponent } from './components/brand-performance-over-time/brand-performance-over-time.component';
import { BtAdAwarenessMainComponent } from './components/bt-ad-awareness-main/bt-ad-awareness-main.component';
import { BtAdAwarenessOverTimeComponent } from './components/bt-ad-awareness-over-time/bt-ad-awareness-over-time.component';
import { BtAdAwarenessComponent } from './components/bt-ad-awareness/bt-ad-awareness.component';
import { BtAssociationInTargetGroupComponent } from './components/bt-association-in-target-group/bt-association-in-target-group.component';
import {
  BtAssociationOverTimeCompetitorsComponent
} from './components/bt-association-over-time-competitors/bt-association-over-time-competitors.component';
import { BtAssociationPerBrandComponent } from './components/bt-association-per-brand/bt-association-per-brand.component';
import { BtAssociationsChartComponent } from './components/bt-associations-chart/bt-associations-chart.component';
import { BtAssociationsComparedToCompetitorsComponent } from './components/bt-associations-compared-to-competitors/bt-associations-compared-to-competitors.component';
import { BtAssociationsComponent } from './components/bt-associations/bt-associations.component';
import { BtBarChartComponent } from './components/bt-bar-chart/bt-bar-chart.component';
import { BtBrandFunnelFooterComponent } from './components/bt-brand-funnel-footer/bt-brand-funnel-footer.component';
import { BtBrandFunnelTableComponent } from './components/bt-brand-funnel-table/bt-brand-funnel-table.component';
import { BtBrandFunnelComponent } from './components/bt-brand-funnel/bt-brand-funnel.component';
import { BtBrandHealthBreakdownComponent } from './components/bt-brand-health-breakdown/bt-brand-health-breakdown.component';
import { BtBrandHealthComparedToCompetitorsComponent } from './components/bt-brand-health-compared-to-competitors/bt-brand-health-compared-to-competitors.component';
import { BtComboChartComponent } from './components/bt-combo-chart/bt-combo-chart.component';
import { BtContentComponent } from './components/bt-content/bt-content.component';
import { BtDashboardWidgetComponent } from './components/bt-dashboard-widget/bt-dashboard-widget.component';
import { BtDashboardComponent } from './components/bt-dashboard/bt-dashboard.component';
import { BtGlobalFilterComponent } from './components/bt-global-filter/bt-global-filter.component';
import { BtGroupedBarChartComponent } from './components/bt-grouped-bar-chart/bt-grouped-bar-chart.component';
import { BtHealthInTargetGroupsComponent } from './components/bt-health-in-target-groups/bt-health-in-target-groups.component';
import { BtHorizontalBarChartComponent } from './components/bt-horizontal-bar-chart/bt-horizontal-bar-chart.component';
import { BtLineChartComponent } from './components/bt-line-chart/bt-line-chart.component';
import { BtMultiselectFilterComponent } from './components/bt-multiselect-filter/bt-multiselect-filter.component';
import { BtNetPromoterScoreMainComponent } from './components/bt-net-promoter-score-main/bt-net-promoter-score-main.component';
import {
  BtNetPromoterScoreOverTimeComponent
} from './components/bt-net-promoter-score-over-time/bt-net-promoter-score-over-time.component';
import { BtNetPromoterScoreComponent } from './components/bt-net-promoter-score/bt-net-promoter-score.component';
import { BtReportComponent } from './components/bt-report/bt-report.component';
import {
  CompetitorsPerformanceOverTimeComponent
} from './components/competitors-performance-over-time/competitors-performance-over-time.component';
import { QuarterPickerComponent } from './components/quarter-picker/quarter-picker.component';
import {
  TargetGroupPerformanceOverTimeComponent
} from './components/target-group-performance-over-time/target-group-performance-over-time.component';


const components = [
  BtReportComponent,
  BtContentComponent,
  // ExportPdfComponent,
  BtDashboardComponent,
  BtBrandFunnelComponent,
  BtBrandHealthBreakdownComponent,
  BtAssociationsComponent,
  BrandHealthOverviewComponent,
  BtLineChartComponent,
  BrandPerformanceOverTimeComponent,
  TargetGroupPerformanceOverTimeComponent,
  BtDashboardWidgetComponent,
  CompetitorsPerformanceOverTimeComponent,
  BtBrandFunnelTableComponent,
  BtBrandFunnelFooterComponent,
  BtMultiselectFilterComponent,
  BtGroupedBarChartComponent,
  BtBrandHealthComparedToCompetitorsComponent,
  BtBarChartComponent,
  BtAssociationsChartComponent,
  BtAssociationsComparedToCompetitorsComponent,
  BtHealthInTargetGroupsComponent,
  BtHorizontalBarChartComponent,
  BtGlobalFilterComponent,
  QuarterPickerComponent,
  BtAssociationPerBrandComponent,
  BtAssociationOverTimeCompetitorsComponent,
  BtAssociationInTargetGroupComponent,
  BaseLocalFiltersComponent,
  BtAdAwarenessComponent,
  BtAdAwarenessMainComponent,
  BtAdAwarenessOverTimeComponent,
  BtNetPromoterScoreComponent,
  BtNetPromoterScoreMainComponent,
  BtAdAwarenessOverTimeComponent,
];

const routes: Routes = [
  {
    path: '',
    component: BtReportComponent,
  },
];

@NgModule({
  declarations: [...components,
    BtNetPromoterScoreOverTimeComponent,
    BtComboChartComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    SharedReportComponentModule,
    AngularSvgIconModule,
    NzDatePickerModule,
    NzIconModule
  ],
  providers: [TestStateService, DatePipe],
  exports: [...components],
})
export class BtModule { }
