import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderService } from '../order/order.service';
import { OrderLibraryItem } from '../../models/order.model';
import { FilterModel } from '../../models/library.model';
import { SortType } from '../../enums/sort.type';
import { TESTS_PER_PAGE } from '../../../core/test-library/services/test-library-state.service';
import { PaginationInstance } from 'ngx-pagination';

@Injectable({
  providedIn: 'root',
})
export class InvoicesStateService {
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: TESTS_PER_PAGE,
    currentPage: 1,
    totalItems: 0,
  };

  private _invoices$: BehaviorSubject<OrderLibraryItem[]> = new BehaviorSubject<
    OrderLibraryItem[]
  >([]);
  private _invoices: OrderLibraryItem[] = [];
  private _initialInvoicesLength = 0;
  private _initialInvoicesLengthAdded = false;
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

  constructor(private orderService: OrderService) {}

  public setInvoices(): void {
    this._getTotalPages();
    this.orderService.getOrders(this._filterOptions).subscribe({
      next: (invoices) => {
        if (invoices.length && !this._initialInvoicesLengthAdded) {
          this._initialInvoicesLength = invoices.length;
          this._initialInvoicesLengthAdded = true;
        }
        this._invoices = invoices;
        this._invoices$.next(invoices);
      },
    });
  }

  public get invoices$(): Observable<OrderLibraryItem[]> {
    return this._invoices$.asObservable();
  }

  public get invoices(): OrderLibraryItem[] {
    return this._invoices;
  }

  public get initInvoicesLength(): number {
    return this._initialInvoicesLength;
  }

  public setNewFilterOptions(filterOptions: FilterModel): void {
    this._filterOptions = filterOptions;
    this.setInvoices();
  }

  public clearInvoices(): void {
    this._invoices = [];
    this._initialInvoicesLength = 0;
    this._initialInvoicesLengthAdded = false;
    this._invoices$.next([]);
    this.config.totalItems = 0;
  }

  private _getTotalPages(): void {
    this.orderService
      .getTotalPages({ ...this._filterOptions, rows: 0, first: 0 })
      .subscribe({
        next: (res) => {
          this.config.totalItems = res;
        },
        error: (err) => console.log(err),
      });
  }
}
