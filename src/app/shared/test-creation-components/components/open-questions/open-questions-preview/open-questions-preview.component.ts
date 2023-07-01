import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import {
  CustomQuestionType,
  OrderCustomQuestionType
} from 'src/app/shared/enums/bic.custom-questions.type';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { PreviewStateService } from 'src/app/shared/services/preview-state-service/preview-state.service';
import { clearBodyLocks, lock } from 'tua-body-scroll-lock';
import { AnswersCustomQuestions } from '../../../../models/bic.test/bic.custom.questions.model';
import { getRandomArray } from '../../../../utils/random-array.utils';
@Component({
  selector: 'app-open-questions-preview',
  templateUrl: './open-questions-preview.component.html',
  styleUrls: ['./open-questions-preview.component.scss'],
})
export class OpenQuestionsPreviewComponent {
  @Input() columns: AnswersCustomQuestions[] = [];
  @ViewChild('gridTable', { static: true }) gridTable: ElementRef<HTMLElement>;
  @Input() rows: AnswersCustomQuestions[] = [];
  @Input() type: number;
  @Input() columnsOrder: number;
  @Input() answersOrder: number;
  @Input() includeDoNotKnow = false;
  @Input() set isOpenedPreview(isOpened: boolean) {
    this._isDefaultOpenedPreview = isOpened;
    if (isOpened) {
      this.onOpenPreview();
    }
  }
  get isOpenedPreview(): boolean {
    return this._isDefaultOpenedPreview;
  }
  @ViewChild('tableHeader') tableHeader: ElementRef;
  @ViewChild('tableBody') tableBody: ElementRef;
  @ViewChild('tableHeaderMobile') tableHeaderMobile: ElementRef;
  @ViewChild('tableBodyMobile') tableBodyMobile: ElementRef;

  public isShowPreview = false;

  private _isDefaultOpenedPreview = false;

  private static setScroll(body: ElementRef, header: ElementRef): void {
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

  constructor(private cdr: ChangeDetectorRef, private _previewStateService: PreviewStateService) { }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get CustomQuestionType(): typeof CustomQuestionType {
    return CustomQuestionType;
  }

  public get columnsData(): AnswersCustomQuestions[] {
    return this.columns.filter((item) => item.position !== -1);
  }

  public onOpenPreview(): void {
    this._checkOrder();
    this.isShowPreview = !this.isShowPreview;
    this.cdr.detectChanges();
    if (this.tableBody) {
      OpenQuestionsPreviewComponent.setScroll(this.tableBody, this.tableHeader);
    }
    if (this.tableBodyMobile) {
      OpenQuestionsPreviewComponent.setScroll(
        this.tableBodyMobile,
        this.tableHeaderMobile
      );
    }

    if (!this._previewStateService.isModalOpened) {
      this.isShowPreview ?
        lock(this.gridTable.nativeElement) :
        clearBodyLocks();
    }

  }

  private _checkOrder(): void {
    if (this.columnsOrder === OrderCustomQuestionType.Random) {
      this.columns = getRandomArray(this.columns);
    }

    if (this.answersOrder === OrderCustomQuestionType.Random) {
      this.rows = getRandomArray(this.rows);
    }
  }
}
