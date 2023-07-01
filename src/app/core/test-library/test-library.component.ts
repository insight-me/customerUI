import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, pluck, switchMap, tap } from 'rxjs/operators';
import { ProductName, TestProductName, TestType } from 'src/app/shared/enums/product.id.type';
import { LibraryTest, ListItem, TestName, TestStatus } from 'src/app/shared/models/test.model';
import { TestService } from 'src/app/shared/services/test/test.service';
import { DEBOUNCE_TIME_FOR_INPUT, PDF_SENDING_TIME } from '../../../assets/consts/consts';
import { ACTIONS_OBJ } from '../../../assets/consts/test-library.consts';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { LibraryTypes } from '../../shared/enums/library.type';
import { SortingType, SortType, TestLibraryFilterType } from '../../shared/enums/sort.type';
import { FilterModel, TableHeaders } from '../../shared/models/library.model';
import { User } from '../../shared/models/user.model';
import { AppStateService } from '../../shared/services/app-state/app-state.service';
import { PaymentStatusService } from '../../shared/services/payment-status/payment-status.service';
import { TestResultService } from '../../shared/services/test/test.result.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { BicReportStateService } from '../test-report/bic/bic.report.state.service';
import { BtReportStateService } from '../test-report/bt/bt.report.state.service';
import { BtStyleService } from '../test-report/bt/bt.style.service';
import { TestLibraryStateService, TESTS_PER_PAGE } from './services/test-library-state.service';

const DESKTOP_CLASS_PARAM = 6;
const STICKY_CLASS_PARAM = 5;

@UntilDestroy()
@Component({
  selector: 'app-test-library',
  templateUrl: './test-library.component.html',
  styleUrls: ['./test-library.component.scss'],
  providers: [DialogService, BtReportStateService, BtStyleService, BicReportStateService, TestLibraryStateService],
})
export class TestLibraryComponent implements OnInit, AfterViewInit {
  public copiedTestId: {
    id: string;
    type: TestType;
    productId: string;
    name: string;
  } = null;
  public tableHeader: TableHeaders[] = [
    {
      name: 'invoices.Test Name',
      sorting: true,
      filtering: false,
      headerId: 0,
      fieldName: 'testName',
    },
    {
      name: 'invoices.Test Type',
      sorting: true,
      filtering: true,
      headerId: 1,
      fieldName: 'testType',
      filterList: ['Brand concept test', 'Brand tracker'],
    },
    {
      name: 'library.date',
      sorting: true,
      filtering: false,
      headerId: 2,
      fieldName: 'publishDate',
    },
    {
      name: 'library.start-date',
      sorting: true,
      filtering: false,
      headerId: 3,
      fieldName: 'startDate',
    },
    {
      name: 'library.end-date',
      sorting: true,
      filtering: false,
      headerId: 3,
      fieldName: 'endDate',
    },
    {
      name: 'library.result-date',
      sorting: true,
      filtering: false,
      headerId: 3,
      fieldName: 'resultDate',
    },
    {
      name: 'library.respondents',
      sorting: true,
      filtering: false,
      headerId: 4,
      fieldName: 'passesPercent',
    },
    {
      name: 'library.status',
      sorting: true,
      filtering: true,
      headerId: 5,
      filterList: ['Draft', 'Ongoing', 'Finished', 'Pending', 'StartFailed'],
      fieldName: 'status',
    },
    {
      name: 'library.report',
      sorting: false,
      filtering: false,
      headerId: 6,
    },
  ];
  @ViewChild('librarySearch') searchElement: ElementRef;

  public bicExportRequest: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public btExportRequest: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public emitedCloseMenu = true;
  public actionsObj = ACTIONS_OBJ;
  private download: Subject<LibraryTest> = new Subject<LibraryTest>();
  private exportSource: Subject<string[]> = new Subject<string[]>();
  private user: User;
  private _filterOptions: FilterModel = {
    first: 0,
    rows: TESTS_PER_PAGE,
    includeDeleted: true,
    sortField: '',
    sortOrder: SortType.Unordered,
    selectFields: [],
    includeProperties: [],
    distinctFields: [],
    filterFields: [],
    filterValues: [],
    filterTypes: [],
  };


  constructor(
    public testLibrarySS: TestLibraryStateService,
    private testService: TestService,
    private router: Router,
    private translateService: TranslateService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private btRSS: BtReportStateService,
    private bicRSS: BicReportStateService,
    private cdr: ChangeDetectorRef,
    private appStateService: AppStateService,
    private testResultService: TestResultService,
    private paymentStatusService: PaymentStatusService,
    private activatedRoute: ActivatedRoute
  ) { }

  private static getReportUrl(testName: TestName): string {
    const reportSubUrl = {
      [TestName.BIC]: 'bic',
      [TestName.BT]: 'bt',
    };
    return reportSubUrl[testName];
  }

  public ngOnInit(): void {
    this.testLibrarySS.getTests();
    if (sessionStorage.getItem('cardPayment')) {
      this.paymentStatusService.changeFailState(true);
      sessionStorage.removeItem('cardPayment');
    } else {
      this.paymentStatusService.changeFailState(this.activatedRoute.snapshot.queryParams?.fail);
    }
    this._addExportReportSubscriptions();
  }

  public ngAfterViewInit(): void {
    fromEvent(this.searchElement?.nativeElement, 'keyup')
      .pipe(
        untilDestroyed(this),
        debounceTime(DEBOUNCE_TIME_FOR_INPUT),
        pluck('target', 'value'),
        distinctUntilChanged<string>(),
        map(value => value),
      )
      .subscribe(value => {
        if (value) {
          if (!this._filterOptions.filterFields.includes('testName')) {
            this._filterOptions.filterFields.push('testName');
          }
          const index = this._filterOptions.filterFields.indexOf('testName');
          this._filterOptions.filterValues[index] = value;
          this._filterOptions.filterTypes[index] = SortingType.Contains;
          this.changePage(1);
        } else {
          if (this._filterOptions.filterFields.includes('testName')) {
            this._removeFilterOptions('testName');
            this.changePage(1);
          }
        }
      });
  }


  public get LibraryTypes(): typeof LibraryTypes {
    return LibraryTypes;
  }

  public get statusEnum(): typeof TestStatus {
    return TestStatus;
  }

  public get ProductName(): typeof ProductName {
    return ProductName;
  }

  public isBT(testType: TestType): boolean {
    return testType === TestType.BT;
  }

  public getProgress(test: LibraryTest): string {
    return this.isBT(test.testType) || test.passesPercent < 0 ? '-' : test.passesPercent + '%';
  }

  public get headerStatusItem(): TableHeaders {
    return this.tableHeader.find(item => item.fieldName === 'status');
  }

  public changePage(event: number): void {
    this.testLibrarySS.config.currentPage = event < 1 ? 1 : event;
    this._filterOptions.first = 15 * (this.testLibrarySS.config.currentPage - 1);
    this._updateTest();
  }

  public deleteTest(test: LibraryTest): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        showHeader: false,
        data: {
          text: this.translateService.instant('library.delete-confirm', {
            name: test.testName,
          }),
          header: 'library.delete-test',
          btn: 'additional.yes',
        },
      });
      ref.onClose.pipe(untilDestroyed(this)).subscribe(res => {
        if (res) {
          this.testService
            .deleteTest(test.id)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this._updateTest();
              this.toastService.showMessage(
                'success',
                this.translateService.instant('t-toast.Success'),
                this.translateService.instant('library.delete-success')
              );
            });
        }
      });
    }
  }

  public copyTest(test): void {
    this.copiedTestId = {
      id: test.id,
      type: test.testType,
      productId: test.productId,
      name: test.testName,
    };
  }

  public onCloseCopy(): void {
    this.copiedTestId = null;
  }

  public navigateToTest(test: LibraryTest): void {
    switch (test.testType) {
      case TestType.BIC:
        this.router.navigate(['/personal-area/create-test/bic', test.id, 'section-1']);
        break;
      case TestType.BT:
        this.router.navigate(['/personal-area/create-test/bt', test.id, 'section-1']);
        break;
    }
  }

  public viewReport(test: LibraryTest): void {
    this.router.navigateByUrl(`/personal-area/test-report/${TestLibraryComponent.getReportUrl(ProductName[test.productName])}/${test.id}`);
  }

  public setHeaderClasses(item): { [key: string]: boolean } {
    return {
      desktop: item.headerId === DESKTOP_CLASS_PARAM,
      'first-column': item.headerId === STICKY_CLASS_PARAM,
      'tablet-sticky': item.headerId === STICKY_CLASS_PARAM,
    };
  }

  public sort(fieldName: string): void {
    if (this._filterOptions.sortField === fieldName) {
      switch (this._filterOptions.sortOrder) {
        case SortType.Ascending:
          this._filterOptions.sortOrder = SortType.Descending;
          break;
        case SortType.Descending:
          this._filterOptions.sortField = '';
          this._filterOptions.sortOrder = SortType.Unordered;
          break;
      }
    } else {
      this._filterOptions.sortField = fieldName;
      this._filterOptions.sortOrder = SortType.Ascending;
    }
    this._updateTest();
  }

  public filter(params: string[], fieldName: string): void {
    let filterValue = '';
    switch (fieldName) {
      case TestLibraryFilterType.TestType:
        filterValue = `array["${params.map(item => TestProductName[item].toString()).join('","')}"]`;
        break;
      case TestLibraryFilterType.Status:
        filterValue = `array["${params.map(item => TestStatus[item].toString()).join('","')}"]`;
    }
    if (this._filterOptions.filterFields.includes(fieldName)) {
      this._removeFilterOptions(fieldName);
    }
    if (params.length) {
      this._filterOptions.filterFields.push(fieldName);
      this._filterOptions.filterValues.push(filterValue);
      this._filterOptions.filterTypes.push(SortingType.Equal);
    }
    this.changePage(1);
  }

  public isSortingUp(fieldName: string): boolean {
    return this._filterOptions.sortField === fieldName && this._filterOptions.sortOrder === SortType.Ascending;
  }

  public isSortingDown(fieldName: string): boolean {
    return this._filterOptions.sortField === fieldName && this._filterOptions.sortOrder === SortType.Descending;
  }

  public isActiveFilter(fieldName: string): boolean {
    return this._filterOptions.filterFields.includes(fieldName);
  }

  public downloadReport(test: LibraryTest): void {
    this.download.next(test);
  }

  public downloadExcel(testId: string, testType: TestType): void {
    this.testResultService.exportExcel(testId, testType).subscribe();
  }

  public downloadCalculatedData(testId: string): void {
    this.testResultService.exportCalculatedData(testId).subscribe();
  }

  public bicExportReady(html: string[]): void {
    this.exportSource.next(html);
    this.bicExportRequest.next(false);
    this.cdr.detectChanges();
  }

  public btExportReady(html: string[]): void {
    this.exportSource.next(html);
    this.btExportRequest.next(false);
    this.cdr.detectChanges();
  }

  private _getReportPdf({ id, productName, testName }: LibraryTest): Observable<any> {
    let service;
    let exportRequest;
    switch (ProductName[productName]) {
      case 'Brand concept test':
        service = this.bicRSS;
        exportRequest = this.bicExportRequest;
        break;
      case 'Brand tracker':
        service = this.btRSS;
        exportRequest = this.btExportRequest;
        break;
    }
    return service.getTestById(id).pipe(
      switchMap(() => service.getReportData().pipe(first())),
      tap(() => exportRequest.next(true)),
      switchMap(() => this.exportSource.asObservable().pipe(first())),
      switchMap((html: string[]) => {
        setTimeout(() => {
          const summary = this.translateService.instant('report.Export PDF');
          const details = this.translateService.instant('report.We have sent you an email with your report');
          this.toastService.showMessage('success', summary, details);
        }, PDF_SENDING_TIME);
        return this.testResultService.exportPdf({ value: html, testName });
      })
    );
  }

  private _addExportReportSubscriptions(): void {

    this.download
      .asObservable()
      .pipe(
        switchMap((test: LibraryTest) => this._getReportPdf(test)),
        untilDestroyed(this)
      )
      .subscribe();

    this.appStateService.currentUser
      .asObservable()
      .pipe(
        filter(value => !!value),
        first(),
        tap(user => (this.user = user))
      )
      .subscribe();

    this.btRSS.brand.valueChanges
      .pipe(
        untilDestroyed(this),
        tap((id: string) => {
          this.btRSS.currentBrand.next(this.btRSS.ownBrands.getValue().find((item: ListItem) => item.id === id).value);
        })
      )
      .subscribe();

    this.btRSS.addHealthInTargetGroupsFilterSubscription().pipe(untilDestroyed(this)).subscribe();
  }

  private _updateTest(): void {
    this.testLibrarySS.setNewFilterOptions(this._filterOptions);
  }

  private _removeFilterOptions(fieldName: string): void {
    const index = this._filterOptions.filterFields.indexOf(fieldName);
    this._filterOptions.filterFields.splice(index, 1);
    this._filterOptions.filterValues.splice(index, 1);
    this._filterOptions.filterTypes.splice(index, 1);
  }
}
