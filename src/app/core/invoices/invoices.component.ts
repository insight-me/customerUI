import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Invoice } from 'src/app/shared/models/invoice.model';
import { FilterModel, TableHeaders } from '../../shared/models/library.model';
import { InvoicesStateService } from '../../shared/services/invoices/invoices-state.service';
import { PaymentStatus } from '../../shared/models/payment.model';
import { PaymentTypeBE } from 'src/app/shared/enums/payment.type';
import { ExportInvoiceService } from '../../shared/services/invoices/export-invoice/export-invoice.service';
import { TestProductName } from 'src/app/shared/enums/product.id.type';
import { InvoiceService } from '../../shared/services/invoices/invoices.service';
import { saveAs } from 'file-saver';
import { OrderLibraryItem } from '../../shared/models/order.model';
import { TESTS_PER_PAGE } from '../test-library/services/test-library-state.service';
import {
  OrderLibraryFilterType,
  SortingType,
  SortType,
} from '../../shared/enums/sort.type';
import { fromEvent, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  takeUntil,
} from 'rxjs/operators';
import { DEBOUNCE_TIME_FOR_INPUT } from '../../../assets/consts/consts';
import { LibraryTypes } from 'src/app/shared/enums/library.type';

const PAYMENT_STATUS_INDEX = 4;
const TEST_NAME_INDEX = 0;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('invoiceSearchRef') searchElement: ElementRef;
  public testNameIndex = TEST_NAME_INDEX;
  public paymentStatusIndex = PAYMENT_STATUS_INDEX;
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
      name: 'invoices.Order Date',
      sorting: true,
      filtering: false,
      headerId: 2,
      fieldName: 'created',
    },
    {
      name: 'invoices.Total Price',
      sorting: true,
      filtering: false,
      headerId: 3,
      fieldName: 'invoiceAmount',
    },
    {
      name: 'invoices.Payment Status',
      sorting: true,
      filtering: true,
      headerId: 4,
      filterList: ['Success', 'Pending'],
      fieldName: 'invoicePaymentStatus',
    },
    {
      name: 'invoices.Payment Type',
      sorting: true,
      filtering: true,
      headerId: 5,
      filterList: ['Card', 'Invoice'],
      fieldName: 'paymentType',
    },
    {
      name: '',
      sorting: false,
      filtering: false,
    },
  ];
  public emitedCloseMenu = true;

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
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public invoiceSS: InvoicesStateService,
    public exportInvoiceS: ExportInvoiceService,
    private invoiceService: InvoiceService
  ) {}

  public ngOnInit(): void {
    this.invoiceSS.setNewFilterOptions(this._filterOptions);
  }

  public ngAfterViewInit(): void {
    fromEvent(this.searchElement?.nativeElement, 'keyup')
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME_FOR_INPUT),
        pluck('target', 'value'),
        distinctUntilChanged<string>(),
        map((value) => value)
      )
      .subscribe((value) => {
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

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get PaymentStatus(): typeof PaymentStatus {
    return PaymentStatus;
  }

  public get PaymentTypeBE(): typeof PaymentTypeBE {
    return PaymentTypeBE;
  }

  public get TestProductName(): typeof TestProductName {
    return TestProductName;
  }

  public get LibraryTypes(): typeof LibraryTypes {
    return LibraryTypes;
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
      case OrderLibraryFilterType.TestType:
        filterValue = `array["${params
          .map((item) => TestProductName[item].toString())
          .join('","')}"]`;
        break;
      case OrderLibraryFilterType.Status:
        filterValue = `array["${params
          .map((item) => PaymentStatus[item].toString())
          .join('","')}"]`;
        break;
      case OrderLibraryFilterType.PaymentType:
        filterValue = `array["${params
          .map((item) => PaymentTypeBE[item].toString())
          .join('","')}"]`;
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
    return (
      this._filterOptions.sortField === fieldName &&
      this._filterOptions.sortOrder === SortType.Ascending
    );
  }

  public isSortingDown(fieldName: string): boolean {
    return (
      this._filterOptions.sortField === fieldName &&
      this._filterOptions.sortOrder === SortType.Descending
    );
  }

  public isActiveFilter(fieldName: string): boolean {
    return this._filterOptions.filterFields.includes(fieldName);
  }

  public changePage(event: number): void {
    this.invoiceSS.config.currentPage = event < 1 ? 1 : event;
    this._filterOptions.first = 15 * (this.invoiceSS.config.currentPage - 1);
    this._updateTest();
  }

  private _updateTest(): void {
    this.invoiceSS.setNewFilterOptions(this._filterOptions);
  }

  private _removeFilterOptions(fieldName: string): void {
    const index = this._filterOptions.filterFields.indexOf(fieldName);
    this._filterOptions.filterFields.splice(index, 1);
    this._filterOptions.filterValues.splice(index, 1);
    this._filterOptions.filterTypes.splice(index, 1);
  }

  public exportInvoice(invoice: OrderLibraryItem): void {
    this.invoiceService.getReceiptByUrl(invoice.azureReceiptUrl).subscribe({
      next: (res) => {
        const blob = new Blob([res.body], { type: 'application/pdf' });
        saveAs(blob, res.url.slice(res.url.indexOf('Receipt/InsightMe')));
      },
      error: (err) => console.log(err),
    });
  }
}
