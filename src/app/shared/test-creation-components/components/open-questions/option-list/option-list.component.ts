import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { FormControl, Validators } from '@angular/forms';
import {
  OPTION_MAX_LENGTH,
  OPTION_MIN_LENGTH,
  ORDER_OPEN_QUESTIONS_OPTIONS,
} from '../../../../../../assets/consts/test-creation.const';
import { OrderOpenQuestionsOptions } from '../../../../models/test-creation.model';
import { OpenQuestionOptionsOrder } from '../../../../enums/bic.creation.type';
import { orderBy, shuffle } from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { checkExist } from '../../../../validators/check-exist.validator';
import { TranslateService } from '@ngx-translate/core';
import { CustomQuestionsType } from '../../../../enums/bic.custom-questions.type';
import { NO_SPACE_PATTERN } from '../../../../../../assets/consts/consts';

@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionListComponent implements AfterViewInit {
  @Input() orderForm: FormControl;
  @Input() min: number;
  @Input() max: number;
  @Input() inputLength = { min: OPTION_MIN_LENGTH, max: OPTION_MAX_LENGTH };
  @Input() type: CustomQuestionsType = CustomQuestionsType.CustomQuestion;
  @Input() options: string[] = [];
  @Input() selectedItems = [];
  @Input() addIncludeDontKnowOption = false;
  @Output() updateOptions: EventEmitter<string[]> = new EventEmitter();
  @Output() updateSelectedItems: EventEmitter<string[]> = new EventEmitter();
  @Output() updateDoNotKnowOption: EventEmitter<boolean> = new EventEmitter();
  public optionFormControl: FormControl;
  public optionsOrder: OrderOpenQuestionsOptions[] =
    ORDER_OPEN_QUESTIONS_OPTIONS;
  public order: OrderOpenQuestionsOptions = ORDER_OPEN_QUESTIONS_OPTIONS[2];

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  public ngAfterViewInit(): void {
    this.optionFormControl = new FormControl(null, [
      Validators.required,
      Validators.minLength(this.inputLength.min),
      Validators.maxLength(this.inputLength.max),
      Validators.pattern(NO_SPACE_PATTERN),
      checkExist(this.options),
    ]);
    this.cdr.detectChanges();
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get CustomQuestionsType(): typeof CustomQuestionsType {
    return CustomQuestionsType;
  }

  public get OpenQuestionOptionsOrder(): typeof OpenQuestionOptionsOrder {
    return OpenQuestionOptionsOrder;
  }

  public addOption(): void {
    if (this.optionFormControl.invalid) {
      return;
    }
    this.options.push(this.optionFormControl.value);
    this.optionFormControl.reset();
    this.sort();
    this.setValidators();
    this.updateOptions.emit(this.options);
  }

  public saveDontKnowOption(event: HTMLInputElement): void {
    this.updateDoNotKnowOption.emit(event.checked);
  }

  public trimValue(): void {
    this.optionFormControl.setValue(this.optionFormControl.value.trim());
  }

  public handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.trimValue();
      if (this.optionFormControl.valid && this.options.length < this.max) {
        this.addOption();
      }
    }
  }

  public changeOrder(event: OrderOpenQuestionsOptions): void {
    this.order = event;
    this.orderForm.setValue(event.value);
    this.sort();
    this.updateOptions.emit(this.options);
  }

  public sort(): void {
    switch (this.order.value) {
      case OpenQuestionOptionsOrder.Alphabetic:
        this.options = orderBy(
          this.options,
          [(option) => option.toLowerCase()],
          ['asc']
        );
        break;
      case OpenQuestionOptionsOrder.Random:
        this.options = shuffle(this.options);
    }
    this.cdr.detectChanges();
  }

  public onRemoveOption(i: number): void {
    this.options.splice(i, 1);
    this.updateOptions.emit(this.options);
    this.setValidators();
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
    this.updateOptions.emit(this.options);
  }

  public getErrorMessage(): string {
    if (this.optionFormControl.errors) {
      if (this.optionFormControl.errors.checkExist) {
        return 'BIC.Option exists';
      } else {
        if (this.optionFormControl.errors.pattern) {
          return 'BIC.Option can not be empty';
        }
        return this.translateService.instant(
          'BIC.Options length must be between X and Y symbols',
          {
            min: this.inputLength.min,
            max: this.inputLength.max,
          }
        );
      }
    }
  }

  public isChecked(option: string): boolean {
    return this.selectedItems.find((item) => item === option);
  }

  public saveSelectedItems(): void {
    this.updateSelectedItems.emit(this.selectedItems);
  }

  private setValidators(): void {
    this.optionFormControl.setValidators([
      Validators.required,
      Validators.minLength(this.inputLength.min),
      Validators.maxLength(this.inputLength.max),
      Validators.pattern(NO_SPACE_PATTERN),
      checkExist(this.options),
    ]);
    this.optionFormControl.updateValueAndValidity();
  }
}
