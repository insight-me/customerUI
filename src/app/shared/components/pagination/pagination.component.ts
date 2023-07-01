import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

const MAX_PAGES_SIZE = 7;
const MIN_PAGES_SIZE = 5;
const CHANGE_SIZE_WINDOW_WIDTH = 767;
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() config;
  @Output() changedPages: EventEmitter<number> = new EventEmitter();
  public elemCount =
    window.innerWidth > CHANGE_SIZE_WINDOW_WIDTH
      ? MAX_PAGES_SIZE
      : MIN_PAGES_SIZE;
  @HostListener('window:resize')
  private windowResize(): void {
    this.elemCount =
      window.innerWidth > CHANGE_SIZE_WINDOW_WIDTH
        ? MAX_PAGES_SIZE
        : MIN_PAGES_SIZE;
  }

  public get pages(): string {
    return `${(this.config.currentPage - 1) * this.config.itemsPerPage + 1} - ${
      this.config.itemsPerPage * this.config.currentPage <
      this.config.totalItems
        ? this.config.itemsPerPage * this.config.currentPage
        : this.config.totalItems
    } of ${this.config.totalItems}`;
  }

  public changePage(ind: number): void {
    this.changedPages.emit(ind);
  }
}
