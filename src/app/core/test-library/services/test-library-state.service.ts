import { ChangeDetectorRef, Injectable } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { BehaviorSubject } from 'rxjs';
import { SortType } from '../../../shared/enums/sort.type';
import { FilterModel } from '../../../shared/models/library.model';
import { LibraryTest } from '../../../shared/models/test.model';
import { TestService } from '../../../shared/services/test/test.service';

export const TESTS_PER_PAGE = 15;

@Injectable()
export class TestLibraryStateService {
  public tests: BehaviorSubject<LibraryTest[]> = new BehaviorSubject<
    LibraryTest[]
  >([]);
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: TESTS_PER_PAGE,
    currentPage: 1,
    totalItems: 0,
  };

  private _initialTestsLength = 0;
  private _initialTestsLengthAdded = false;
  private _tests: LibraryTest[] = [];
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

  constructor(private testService: TestService, private cdRef: ChangeDetectorRef) { }

  public get initTestsLength(): number {
    return this._initialTestsLength;
  }

  public getTests(): void {
    this._getTotalPages();
    this.testService.getFilteredTests(this._filterOptions).subscribe({
      next: (res) => {
        if (res.length && !this._initialTestsLengthAdded) {
          this._initialTestsLength = res.length;
          this._initialTestsLengthAdded = true;
        }
        this._tests = res;
        this.tests.next(this._tests);
        this.cdRef.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  public setNewFilterOptions(filterOptions: FilterModel): void {
    this._filterOptions = filterOptions;
    this.getTests();
  }

  private _getTotalPages(): void {
    this.testService
      .getTotalPages({ ...this._filterOptions, rows: 0, first: 0 })
      .subscribe({
        next: (res) => {
          this.config.totalItems = res;
        },
        error: (err) => console.log(err),
      });
  }
}
