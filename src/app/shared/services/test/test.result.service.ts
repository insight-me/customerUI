import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { PDF_SENDING_TIME } from 'src/assets/consts/consts';
import { TestResultFilterModel } from '../../models/bic.test.report/test.result.filter.model';
import { TestResultModel } from '../../models/bic.test.report/test.result.model';
import { BtTestResultModel } from '../../models/bt.test.report/bt.test.result.model';
import { AppStateService } from '../app-state/app-state.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TestResultService {
  constructor(
    private httpClient: HttpClient,
    private appStateService: AppStateService,
    private translateService: TranslateService,
    private toastService: ToastService
  ) { }

  public getTestResultByFilter(
    body: TestResultFilterModel,
    testId: string
  ): Observable<TestResultModel> {
    const url = 'api/TestResult/GetTestResultByFilter';
    const params = new HttpParams().set('testID', testId);
    const options = { params };
    return this.httpClient.post<TestResultModel>(url, body, options);
  }

  public exportExcel(testId: string, testType: TestType): Observable<Blob> {
    const testPath = testType === TestType.BIC ? 'BICTest' : 'BTTest';
    // @ts-ignore
    return this.appStateService.language.asObservable().pipe(
      switchMap((language: string) =>
        this.httpClient.get<Blob>(
          `api/${testPath}/ExportAnswersExcel?testId=${testId}&language=${language.toUpperCase()}`
        )
      ),
      tap(() => {
        const summary = this.translateService.instant('report.Export Raw Data');
        const details = this.translateService.instant(
          'report.We have sent you an email with your report'
        );
        this.toastService.showMessage('success', summary, details);
      }),
      takeUntil(timer(PDF_SENDING_TIME))
    );
  }

  public exportCalculatedData(testId: string): Observable<Blob> {
    // @ts-ignore
    return this.appStateService.language.asObservable().pipe(
      switchMap((language: string) =>
        this.httpClient.get<Blob>(
          `api/BICTest/ExportExcel?testId=${testId}&language=${language.toUpperCase()}`
        )
      ),
      tap(() => {
        const summary = this.translateService.instant(
          'report.Export Calculated Data'
        );
        const details = this.translateService.instant(
          'report.We have sent you an email with your report'
        );
        this.toastService.showMessage('success', summary, details);
      }),
      takeUntil(timer(PDF_SENDING_TIME))
    );
  }

  public exportPdf(payload: {
    value: string[];
    testName: string;
  }): Observable<Blob> {
    // @ts-ignore
    return this.appStateService.language.asObservable().pipe(
      switchMap((language: string) =>
        this.httpClient.post<Blob>(
          `api/TestResult/ExportPDF`,
          { ...payload, language } /*, { responseType: 'blob'}*/
        )
      ),
      takeUntil(timer(PDF_SENDING_TIME))
    );
  }

  public getBTTestResultByFilter(
    body: TestResultFilterModel,
    testId: string
  ): Observable<BtTestResultModel> {
    const url = 'api/TestResult/GetBTTestResultByFilter';
    !body && (body = {});
    const params = new HttpParams().set('testID', testId);
    const options = { params };
    return this.httpClient.post<BtTestResultModel>(url, body, options);
  }
}
