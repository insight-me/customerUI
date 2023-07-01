import { PaginationInstance } from 'ngx-pagination';
import { PAGES_DROPDOWN_ITEMS } from 'src/assets/consts/test-creation.const';

// tslint:disable-next-line: typedef
export function saveDropdown(target: any) {
  let config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };
  let selectedDropdownItem = PAGES_DROPDOWN_ITEMS[0];

  const originalNgOnDestroy = target.prototype.ngOnDestroy;
  const originalNgOnInit = target.prototype.ngOnInit;

  target.prototype.ngOnInit = function () {
    if (typeof originalNgOnInit === 'function') {
      originalNgOnInit.apply(this);
    }
    this.config = config;
    this.selectedDropdownItem = selectedDropdownItem;
  };

  target.prototype.ngOnDestroy = function () {
    if (typeof originalNgOnDestroy === 'function') {
      originalNgOnDestroy.apply(this);
    }
    config = this.config;
    selectedDropdownItem = this.selectedDropdownItem;
  };

  if (!originalNgOnInit) {
    target.prototype.ngOnInit = function () {
      this.config = config;
      this.selectedDropdownItem = selectedDropdownItem;
    };
  }

  if (!originalNgOnDestroy) {
    target.prototype.ngOnDestroy = function () {
      config = this.config;
      selectedDropdownItem = this.selectedDropdownItem;
    };
  }


}
