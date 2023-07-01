import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CustomQuestionType } from '../../enums/bic.custom-questions.type';
import { AnswersCustomQuestions } from '../../models/bic.test/bic.custom.questions.model';
import { GRID_TABLE_SWIPER_CONFIG } from '../../../../assets/consts/swiper.consts';
import { SwiperOptions } from 'swiper';
import {
  DESKTOP_VERSION,
  MOBILE_VERSION,
} from '../../../../assets/consts/consts';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: [
    './grid-table.component.scss',
    '../components/open-questions/open-questions-preview/open-questions-preview.component.scss',
  ],
})
export class GridTableComponent implements OnInit {
  @ViewChild('tableHeader') tableHeader: ElementRef;
  @ViewChild('tableBody') tableBody: ElementRef;
  @ViewChild('tableHeaderMobile') tableHeaderMobile: ElementRef;
  @ViewChild('tableBodyMobile') tableBodyMobile: ElementRef;

  @Input() columns: AnswersCustomQuestions[] = [];
  @Input() rows: AnswersCustomQuestions[] = [];
  @Input() set rowsLength(data: number) {
    if (this.tableBody) {
      this._setScroll(this.tableBody, this.tableHeader);
    }
  }
  @Input() type: number;
  @Input() columnsOrder: number;
  @Input() answersOrder: number;
  @Input() includeDoNotKnow = false;
  @Input() selectedOptions: string[] = [];

  @Output() addSelectedAnswers: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  public config: SwiperOptions = GRID_TABLE_SWIPER_CONFIG;
  public isTabletVersion = false;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  constructor() {}

  public ngOnInit(): void {
    this._updateIsTablet();
  }

  public get CustomQuestionType(): typeof CustomQuestionType {
    return CustomQuestionType;
  }

  public saveSelectedItems(): void {
    this.addSelectedAnswers.emit(this.selectedOptions);
  }

  public saveSingleSelectedItems(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const ind = this.selectedOptions
      .map((item) => item.split(' / ')[0])
      .indexOf(value.split(' / ')[0]);
    if (ind !== -1) {
      this.selectedOptions[ind] = value;
    } else {
      this.selectedOptions.push(value);
    }
    this.addSelectedAnswers.emit(this.selectedOptions);
  }

  public isChecked(value: string): boolean {
    return this.selectedOptions.includes(value);
  }

  public getWidthForProgress(): number {
    let selectedAnswers = 0;
    const selectedRows = this.selectedOptions.map(
      (item) => item.split(' / ')[0]
    );
    this.rows.forEach((answer) => {
      if (selectedRows.includes(answer.value)) {
        selectedAnswers += 1;
      }
    });
    return (100 / this.rows.length) * selectedAnswers;
  }

  private _updateIsTablet(): void {
    this.isTabletVersion = window.innerWidth <= DESKTOP_VERSION;
    if (this.tableBody) {
      this._setScroll(this.tableBody, this.tableHeader);
    }
  }

  private _setScroll(body: ElementRef, header: ElementRef): void {
    const scrollHeight = Math.max(
      body.nativeElement.scrollHeight,
      body.nativeElement.scrollHeight,
      body.nativeElement.offsetHeight,
      body.nativeElement.offsetHeight,
      body.nativeElement.clientHeight,
      body.nativeElement.clientHeight
    );
    if (body.nativeElement.clientHeight < scrollHeight) {
      header.nativeElement.classList.add('scroll');
    } else {
      header.nativeElement.classList.remove('scroll');
    }
  }
}
