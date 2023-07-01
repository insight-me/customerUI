import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PaginationInstance } from 'ngx-pagination';
import { saveDropdown } from 'src/app/shared/decorators/save-answers.decorator';
import { PAGES_DROPDOWN_ITEMS } from '../../../../../assets/consts/test-creation.const';
import { AccumulatedFeedback } from '../../../../shared/models/bic.test.report/test.concept.result.model';

@saveDropdown
@Component({
  selector: 'app-answers-table',
  templateUrl: './answers-table.component.html',
  styleUrls: ['./answers-table.component.scss'],
})
export class AnswersTableComponent implements OnChanges {
  @Input() public answers: AccumulatedFeedback[] = [];
  public pagesDropdownItems: { name: string; num: number }[] =
    PAGES_DROPDOWN_ITEMS;
  public selectedDropdownItem = PAGES_DROPDOWN_ITEMS[0];
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(public sanitizer: DomSanitizer) { }


  public ngOnChanges(changes: SimpleChanges): void {
    this.config.currentPage = 1;
  }

  public onChangeNumberOfPages(event: { name: string; num: number }): void {
    this.selectedDropdownItem = event;
    this.config.itemsPerPage = this.selectedDropdownItem.num;
    this.config.currentPage = 0;
  }

  public getHtml(text: string): string {
    return text.replace(new RegExp('\n', 'gi'), '<br>');
  }
}
