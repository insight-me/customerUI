import {
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { PDF_SENDING_TIME } from '../../../../../assets/consts/consts';
import { AppStateService } from '../../../../shared/services/app-state/app-state.service';
import { TestResultService } from '../../../../shared/services/test/test.result.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-base-content',
  template: '',
})
export class BaseContentComponent implements OnDestroy {
  public subscriptions: Subscription = new Subscription();
  public exportSource: Subject<string[]> = new Subject<string[]>();

  private appStateService: AppStateService;
  private translateService: TranslateService;
  private toastService: ToastService;
  private cdr: ChangeDetectorRef;

  public exportRequest: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  // public exportExelRequest: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected injector: Injector) {
    this.appStateService = injector.get(AppStateService);
    this.translateService = injector.get(TranslateService);
    this.toastService = injector.get(ToastService);
    this.cdr = injector.get(ChangeDetectorRef);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public export(canExport: boolean): void {
    if (canExport) {
      this.exportRequest.next(true);
    }
  }

  public exportExcel(
    exportService: TestResultService,
    testId: string,
    testType: TestType
  ): Observable<any> {
    return exportService.exportExcel(testId, testType);
  }

  public exportCalculatedData(
    exportService: TestResultService,
    testId: string
  ): Observable<any> {
    return exportService.exportCalculatedData(testId);
  }

  public exportReport(
    html: string[],
    exportService: TestResultService,
    testName: string
  ): Observable<any> {
    setTimeout(() => {
      const summary = this.translateService.instant('report.Export PDF');
      const details = this.translateService.instant(
        'report.We have sent you an email with your report'
      );
      this.toastService.showMessage('success', summary, details);
    }, PDF_SENDING_TIME);
    return exportService.exportPdf({ value: html, testName });
  }

  public exportReady(html: string[]): void {
    this.exportSource.next(html);
    this.exportRequest.next(false); // remove to see PDF
    this.cdr.detectChanges();
  }
}
