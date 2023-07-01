import { ChangeDetectionStrategy, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { exhaustMap, tap } from 'rxjs/operators';
import { Test, TestStatus } from 'src/app/shared/models/test.model';
import { BtReportTabType } from '../../../../../shared/enums/bt.report.tab.type';
import { TestResultService } from '../../../../../shared/services/test/test.result.service';
import { BaseContentComponent } from '../../../components/base-content/base-content.component';
import { ReportCustomQuestionsService } from '../../../report.custom-questions.service';
import { BtReportStateService } from '../../bt.report.state.service';

@Component({
  selector: 'app-bt-content',
  templateUrl: './bt-content.component.html',
  styleUrls: ['../../../components/base-content/base-content.component.scss',
    './bt-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtContentComponent extends BaseContentComponent implements OnInit, OnDestroy {
  public tabIndex: BtReportTabType = BtReportTabType.Dashboard;
  public BtReportTabType = BtReportTabType;
  public TestStatus = TestStatus;

  constructor(
    public btRSS: BtReportStateService,
    private testResultService: TestResultService,
    protected injector: Injector,
    private reportCustomQuestionsService: ReportCustomQuestionsService<Test>
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.subscriptions.add(this.btRSS.addHealthInTargetGroupsFilterSubscription().subscribe());
    this.subscriptions.add(
      this.exportSource
        .asObservable()
        .pipe(
          exhaustMap((html: string[]) => this.exportReport(html, this.testResultService, this.btRSS.test.testName)),
          tap(blob => saveAs(blob, `brand_tracking.pdf`))
        )
        .subscribe()
    );
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.reportCustomQuestionsService.tabNumber = 0;
  }
}
