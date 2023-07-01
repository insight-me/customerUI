import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListItem } from '../../models/test.model';
import { cloneDeep, map } from 'lodash';
import { INPUT_MIN_LENGTH } from 'src/assets/consts/consts';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { checkExist } from '../../validators/check-exist.validator';
import { IconsType } from '../../enums/icons.type';
import { wordCountValidator } from '../../validators/word.count.validator';
import { ListItemType } from '../../enums/list-item.type';
import { MAX_BENEFITS_RTB_WORDS, MIN_BENEFITS_RTB_WORDS } from '../../../../assets/consts/test-creation.const';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
})
export class ListItemsComponent implements OnInit {
  @Input() public isLimitExceeded = false;
  @Input() public isHideAdded = false;
  @Input() public allAssociations = [];
  @Input() public disabledButton = false;
  @Input() set disabledField(isDisabled) {
    this.disableField = isDisabled;
    isDisabled ? this.nameControl.disable() : this.nameControl.enable();
  }

  @Input()
  public set items(data: any[]) {
    this.list = cloneDeep(data) || [];
    this.initList();
    this.setValidators();
    if (this.nameControl?.value) {
      this.nameControl.patchValue('');
      this.nameControl.markAsUntouched();
      this.nameControl.markAsPristine();
    }
  }

  @Input()
  public set associations(data: any[]) {
    this.association = map(data, 'text');
    this.setValidators();
  }

  @Input() public showButtonAdd = true;
  @Input() public showButtonDelete = true;
  @Input() public showCheckboxes = false;
  @Input() public textField = 'value';
  @Input() public dataType: ListItemType = null;
  @Input() private inputMinLength: number = INPUT_MIN_LENGTH;
  @Input() public inputMaxLength = 0;
  @Input() public max = 0;
  @Output() public updateItems = new EventEmitter();
  @Output() public addDefaultAssociation = new EventEmitter();
  @ViewChild('listInput') public listInput: ElementRef;
  public formArray = new FormArray([]);
  public list: ListItem[] = [];
  public nameControl = new FormControl('');
  public association: any[] = [];
  public disableField = false;

  constructor(private fb: FormBuilder, public toastService: ToastService, private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.setValidators();
  }

  public newGroup(value?: string, isSaved?: boolean, id?: string): FormGroup {
    return this.fb.group({
      id: [id || ''],
      isSelected: [false],
      value: [{ value: value || '', disabled: isSaved }, Validators.required],
      isSaved: [isSaved || false],
    });
  }

  public controlHasError(): any {
    if (this.nameControl.touched && this.nameControl.invalid) {
      return this.nameControl.errors;
    }
    return null;
  }

  public trimValue(): void {
    this.nameControl.setValue(this.nameControl.value?.trim());
  }

  public handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.listInput.nativeElement.blur();
      if (this.nameControl.valid && !this.disabledButton) {
        this.saveValue();
      }
    }
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public getErrorMessage(error: any): string {
    if (this.dataType === ListItemType.Benefits || this.dataType === ListItemType.RTB) {
      if (error.wordCount) {
        return this.translateService.instant('test-concept.error-words-length', {
          dataType: this.dataType,
          min: MIN_BENEFITS_RTB_WORDS,
          max: MAX_BENEFITS_RTB_WORDS,
        });
      }
    } else {
      if (error.minlength || error.maxlength || error.required) {
        if (this.inputMaxLength) {
          return this.translateService.instant('test-concept.error-length', {
            dataType: this.dataType,
            min: this.inputMinLength,
            max: this.inputMaxLength,
          });
        } else {
          return this.translateService.instant('test-concept.error-length-min', {
            dataType: this.dataType,
            min: this.inputMinLength,
          });
        }
      }
    }
    if (this.isHideAdded) {
      return 'test-concept.error-exist-association';
    }
    if (error.checkExist) {
      switch (this.dataType) {
        case ListItemType.Benefits:
          return 'test-concept.error-exist-benefit';
        case ListItemType.RTB:
          return 'test-concept.error-exist-reason';
      }
    }
  }

  public getPlaceholder(): string {
    if (this.isHideAdded) {
      return 'associations.type-custom';
    }
    switch (this.dataType) {
      case ListItemType.Benefits:
        return 'test-concept.type-benefit';
      case ListItemType.RTB:
        return 'test-concept.type-reason-to-believe';
    }
  }

  public getAddedText(): string {
    switch (this.dataType) {
      case ListItemType.Benefits:
        return 'test-concept.already-added-benefits';
      case ListItemType.RTB:
        return 'test-concept.already-added-reasons-to-believe';
    }
  }

  public addControl(item?: any, isSaved?: boolean): void {
    this.formArray.push(this.newGroup(item ? item[this.textField] : '', isSaved, item?.id));
  }

  public removeItem(index: number): void {
    this.list = this.list.filter((item, i) => i !== index);
    this.updateItems.emit(this.list);
    this.setValidators();
  }

  public saveValue(): void {
    if (this.isLimitExceeded) {
      this.toastService.showMessage(
        'error',
        this.translateService.instant('associations.error-max', {
          type: this.dataType.toLowerCase(),
          max: this.max,
        }),
        ''
      );
      return;
    }
    if (this.allAssociations.length) {
      const associationFromList = this.allAssociations.find(
        item => item.text.toLowerCase().trim() === this.nameControl.value.toLowerCase().trim()
      );
      if (associationFromList) {
        this.addDefaultAssociation.emit(associationFromList);
      } else {
        this.list.push({ value: this.nameControl.value });
        this.updateItems.emit(this.list);
      }
    } else {
      this.list.push({ value: this.nameControl.value });
      this.updateItems.emit(this.list);
    }
    this.nameControl.reset();
    this.setValidators();
  }

  private initList(): void {
    this.formArray = new FormArray([]);
    if (this.list.length) {
      this.list.forEach(item => {
        this.addControl(item, true);
      });
    }
  }

  private setValidators(): void {
    if (this.dataType === ListItemType.Benefits || this.dataType === ListItemType.RTB) {
      this.nameControl.setValidators([
        Validators.required,
        wordCountValidator(MIN_BENEFITS_RTB_WORDS, MAX_BENEFITS_RTB_WORDS),
        checkExist(map(this.list, 'value')),
      ]);
      return;
    }
    if (this.isHideAdded) {
      this.nameControl.setValidators([
        Validators.required,
        Validators.minLength(+this.inputMinLength),
        Validators.maxLength(+this.inputMaxLength),
        checkExist(map(this.list, 'value').concat(this.association)),
      ]);
    } else {
      this.nameControl.setValidators([
        Validators.required,
        Validators.minLength(+this.inputMinLength),
        Validators.maxLength(+this.inputMaxLength),
        checkExist(map(this.list, 'value')),
      ]);
    }
  }
}
