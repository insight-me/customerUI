import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { exhaustMap, tap } from 'rxjs/operators';
import { TestStatus } from 'src/app/shared/models/test.model';
import { SwiperOptions } from 'swiper';
import { REPORT_SUBHEADER_SWIPER_CONFIG } from '../../../../../../assets/consts/swiper.consts';
import { TestResultService } from '../../../../../shared/services/test/test.result.service';
import { BaseContentComponent } from '../../../components/base-content/base-content.component';
import { BicReportStateService } from '../../bic.report.state.service';
import { ExportContainerComponent } from '../export-container/export-container.component';

@Component({
  selector: 'app-export-report',
  templateUrl: './export-report.component.html',
  styleUrls: [
    '../../../components/base-content/base-content.component.scss',
    '../concept-definitions/concept-definitions.component.scss',
  ],
})
export class ExportReportComponent
  extends BaseContentComponent
  implements OnInit, OnDestroy {
  @ViewChild(ExportContainerComponent)
  private ExportContainerComponent: ExportContainerComponent;
  public TestStatus = TestStatus;
  public swiperConfig: SwiperOptions = REPORT_SUBHEADER_SWIPER_CONFIG;
  public isChooseConceptActive = false;

  constructor(
    public bicRSS: BicReportStateService,
    private testResultService: TestResultService,
    protected injector: Injector
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.exportSource
        .asObservable()
        .pipe(
          exhaustMap((html: string[]) =>
            this.exportReport(
              html,
              this.testResultService,
              this.bicRSS.test.testName
            )
          ),
          tap((blob) => saveAs(blob, `brand_&_innovation_concept.pdf`))
        )
        .subscribe()
    );
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public showConcepts(): void {
    this.isChooseConceptActive = !this.isChooseConceptActive;
  }

  public exportAsExcel(): void {
    this.exportExcel(this.testResultService, this.bicRSS.test.id, this.bicRSS.test.testType).subscribe({
      next: () => { },
      error: () => { },
    });
  }

  public exportCalcData(): void {
    this.exportCalculatedData(this.testResultService, this.bicRSS.test.id)
      .subscribe({
        next: () => { },
        error: () => { },
      });
  }
}
