import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Test, TestStatus } from 'src/app/shared/models/test.model';
import { SwiperOptions } from 'swiper';
import { REPORT_SUBHEADER_SWIPER_CONFIG } from '../../../../../../assets/consts/swiper.consts';
import { BicReportTabType } from '../../../../../shared/enums/bic.report.tab.type';
import { BaseContentComponent } from '../../../components/base-content/base-content.component';
import { ReportCustomQuestionsService } from '../../../report.custom-questions.service';
import { BicReportStateService } from '../../bic.report.state.service';
import { ExportContainerComponent } from '../export-container/export-container.component';

@Component({
  selector: 'app-report-content',
  templateUrl: './report-content.component.html',
  styleUrls: ['../../../components/base-content/base-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportContentComponent
  extends BaseContentComponent
  implements OnInit, OnDestroy {
  @ViewChild(ExportContainerComponent)
  private ExportContainerComponent: ExportContainerComponent;
  public tabIndex: BicReportTabType = BicReportTabType.OverallScore;
  public BicReportTabType = BicReportTabType;
  public TestStatus = TestStatus;
  public swiperConfig: SwiperOptions = REPORT_SUBHEADER_SWIPER_CONFIG;

  constructor(
    public bicRSS: BicReportStateService,
    protected injector: Injector,
    private reportCustomQuestionsService: ReportCustomQuestionsService<Test>
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    // this.subscriptions.add(this.bicRSS.getReportData().subscribe());
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.reportCustomQuestionsService.tabNumber = 0;
  }

  public get showConceptDefinitions(): boolean {
    const { test } = this.bicRSS;
    if (!test) {
      return false;
    }
    return test.wordsLikesEnabled || test.testConceptRelevance;
  }

  public get showAdditionalQuestions(): boolean {
    const { test } = this.bicRSS;
    if (!test) {
      return false;
    }
    return (
      test.feedbackLike || test.feedbackThink || !!test.customQuestions.length
    );
  }

  public get showMoodboard(): boolean {
    const { test } = this.bicRSS;
    if (!test) {
      return false;
    }
    return test.imageLikesEnabled;
  }
}
