import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReportContainerComponent } from './components/report-container/report-container.component';
import { TestDataService } from './test.data.service';
import { ReportCustomQuestionsService } from './report.custom-questions.service';

const routes: Routes = [
  {
    path: '',
    component: ReportContainerComponent,
    children: [
      {
        path: 'bic/:id',
        loadChildren: () =>
          import('../test-report/bic/bic.module').then(
            module => module.BicModule
          ),
      },
      {
        path: 'bt/:id',
        loadChildren: () =>
          import('../test-report/bt/bt.module').then(module => module.BtModule),
      },
    ],
  },
];

@NgModule({
  declarations: [ReportContainerComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [TestDataService, ReportCustomQuestionsService],
})
export class TestReportModule {}
