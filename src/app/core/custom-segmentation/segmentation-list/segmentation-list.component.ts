import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'lodash';
import { IconsType } from 'src/app/shared/enums/icons.type';
import {
  MAX_CONSTANT,

  MIN_CONSTANT
} from '../../../../assets/consts/segmentation.consts';
import {
  CustomSegment,
  MySegmentsList,
  SegmentQuestion
} from '../../../shared/models/custom-segmentation.model';
import { CreateSegmentationService } from '../../../shared/services/segmentation/create-segmentation.service';
import { checkExist } from '../../../shared/validators/check-exist.validator';
import { compareNumbers } from '../../../shared/validators/compare-numbers.validator';

@Component({
  selector: 'app-segmentation-list',
  templateUrl: './segmentation-list.component.html',
  styleUrls: ['./segmentation-list.component.scss'],
})
export class SegmentationListComponent implements OnInit, OnChanges {
  @Input() public dataType: string;
  @Input() private inputMinLength: number;
  @Input() public inputMaxLength: number;
  @Input() public isEditMode: boolean;
  @Input() public limitNumber: number;
  @Input() public minValue: number;
  @Input() public maxValue: number;
  @Input() private items: CustomSegment[] | SegmentQuestion[] = [];
  @Output() public updateItems = new EventEmitter();
  @ViewChild('segmentationInput') public segmentationInput: ElementRef;
  public list: MySegmentsList[] = [];
  public nameControl = new FormControl('');
  public constantGroup: FormGroup;
  public count = 0;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private createSegmentationService: CreateSegmentationService
  ) { }

  public ngOnInit(): void {
    this.setValidators();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.constantGroup) {
      this.constantGroup = this.fb.group({});
    }
    if (this.items?.length && !changes.items.previousValue?.length) {
      this.list = [];
      this.items.forEach((elem, i) => {
        this.list.push(elem);
        this.list[i].count = this.count++;
      });
      this.constantGroup = this.fb.group({});
      this.initForm();
    }
  }

  public getPlaceholder(): string {
    switch (this.dataType) {
      case 'Segment':
        return this.translateService.instant(
          'segmentation.segment-placeholder'
        );
      case 'Statement':
        return this.translateService.instant(
          'segmentation.question-placeholder'
        );
    }
  }

  public trimValue(): void {
    this.nameControl.setValue(this.nameControl.value.trim());
  }

  public handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.segmentationInput.nativeElement.blur();
      if (this.nameControl.valid) {
        this.saveValue();
      }
    }
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public controlHasError(): ValidationErrors {
    if (this.nameControl.touched && this.nameControl.invalid) {
      return this.nameControl.errors;
    }
    return null;
  }

  public getErrorMessageForCount(num: number, control: string): string {
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[control].errors
        .required
    ) {
      return control === 'constant'
        ? 'segmentation.coef-error-required'
        : 'segmentation.ir-error-required';
    }
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[control].errors
        .min
    ) {
      return 'segmentation.coef-error-min';
    }
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[control].errors
        .max
    ) {
      return 'segmentation.coef-error-max';
    }
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[control].errors
        .pattern
    ) {
      return 'segmentation.coef-error-pattern';
    }
  }

  public getErrorMessageForStatements(num: number, contr: string): string {
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[contr].errors
        .required
    ) {
      return 'segmentation.statement-error-required';
    }
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[contr].errors.max
    ) {
      return this.translateService.instant('segmentation.statement-error-max') + this.maxValue;
    }
    if (
      (this.constantGroup.controls[num] as FormGroup).controls[contr].errors
        .compareNumbers || (this.constantGroup.controls[num] as FormGroup).controls[contr].errors.min
    ) {
      return this.translateService.instant(
        'segmentation.statement-error-compare',
        {
          num: (this.constantGroup.controls[num] as FormGroup).controls.min
            .value + 1,
        }
      );
    }
  }

  public getErrorMessage(error: ValidationErrors): string {
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
    if (error.checkExist) {
      switch (this.dataType) {
        case 'Segment':
          return this.translateService.instant(
            'segmentation.segment-exist-error'
          );
        case 'Statement':
          return this.translateService.instant(
            'segmentation.statement-exist-error'
          );
      }
    }
  }

  public saveValue(): void {
    if (this.dataType === 'Segment') {
      this.createSegmentationService.isFirstStepDone.next(false);
      this.list.push({
        displayText: this.nameControl.value,
        constant: null,
        count: this.count,
        ir: null,
      });
      this.constantGroup.addControl(
        this.count.toString(),
        this.fb.group({
          IR: this.fb.control(null, [
            Validators.required,
            Validators.min(0),
            Validators.max(100),
          ]),
          constant: this.fb.control(null, [
            Validators.required,
            Validators.min(MIN_CONSTANT),
            Validators.max(MAX_CONSTANT),
          ]),
        })
      );
    } else {
      this.createSegmentationService.isSecondStepDone.next(false);
      this.list.push({
        displayText: this.nameControl.value,
        minValue: null,
        maxValue: null,
        count: this.count,
      });
      this.constantGroup.addControl(
        this.count.toString(),
        this.fb.group(
          {
            min: this.fb.control(null, [
              Validators.required,
              Validators.min(this.minValue),
              Validators.max(this.maxValue),
            ]),
            max: this.fb.control(null, [
              Validators.required,
              Validators.min(this.minValue),
              Validators.max(this.maxValue),
            ]),
          },
          {
            validators: [compareNumbers('min', 'max')],
          }
        )
      );
    }
    this.count += 1;
    this.nameControl.reset();
    this.updateItems.emit(this.list);
    this.setValidators();
  }

  public saveConstant(index: number, count: number): void {
    if (
      (this.constantGroup.controls[count.toString()] as FormGroup).controls
        .constant.value
    ) {
      const withoutLetters = (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.constant.value.replace(/[^0-9.,-]/g, '');
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.constant.setValue(withoutLetters);
    }
    if (
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.constant.value
        ?.toString()
        .includes(',')
    ) {
      const newNum = (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.constant.value.replace(',', '.');
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.constant.setValue(+newNum);
    }
    if (
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.constant.value
        ?.toString()
        .split('.')?.length > 1
    ) {
      if (
        (
          this.constantGroup.controls[count.toString()] as FormGroup
        ).controls.constant.value
          ?.toString()
          .split('.')[1].length > 3
      ) {
        const num = `${(
          this.constantGroup.controls[count.toString()] as FormGroup
        ).controls.constant.value
          ?.toString()
          .split('.')[0]
          }.${(
            this.constantGroup.controls[count.toString()] as FormGroup
          ).controls.constant.value
            ?.toString()
            .split('.')[1]
            .substr(0, 3)}`;
        (
          this.constantGroup.controls[count.toString()] as FormGroup
        ).controls.constant.setValue(+num);
      }
    }
    this.list[index].constant = (
      this.constantGroup.controls[count.toString()] as FormGroup
    ).controls.constant.value;
    this.updateItems.emit(this.list);
  }

  public saveIR(index: number, count: number): void {
    if (
      (this.constantGroup.controls[count.toString()] as FormGroup).controls.IR
        .value
    ) {
      const withoutDot = (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.IR.value.replace(/[^0-9]/g, '');
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.IR.setValue(+withoutDot);
    }
    this.list[index].ir = (
      this.constantGroup.controls[count.toString()] as FormGroup
    ).controls.IR.value;
    this.updateItems.emit(this.list);
  }

  public saveMin(index: number, count: number): void {
    if (
      (this.constantGroup.controls[count.toString()] as FormGroup).controls.min
        .value
    ) {
      const withoutDot = (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.min.value.replace(/[^0-9]/g, '');
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.min.setValue(+withoutDot);
    }
    this.list[index].minValue = (
      this.constantGroup.controls[count.toString()] as FormGroup
    ).controls.min.value;
    this.updateItems.emit(this.list);
  }

  public saveMax(index: number, count: number): void {
    if (
      (this.constantGroup.controls[count.toString()] as FormGroup).controls.max
        .value
    ) {
      const withoutDot = (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.max.value.replace(/[^0-9]/g, '');
      (
        this.constantGroup.controls[count.toString()] as FormGroup
      ).controls.max.setValue(+withoutDot);
    }
    this.list[index].maxValue = (
      this.constantGroup.controls[count.toString()] as FormGroup
    ).controls.max.value;
    this.updateItems.emit(this.list);
  }

  public removeItem(index: number): void {
    this.list = this.list.filter((item, i) => i !== index);
    this.constantGroup = this.fb.group({});
    if (this.dataType === 'Segment') {
      this.fillSegmentForm();
    } else {
      this.fillStatementForm();
    }
    this.updateItems.emit(this.list);
    this.setValidators();
  }

  public getLimit(): string {
    if (this.list.length > this.limitNumber) {
      switch (this.dataType) {
        case 'Segment':
          return 'segmentation.max-10';
        case 'Statement':
          return 'segmentation.max-30';
      }
    }
    return null;
  }

  private setValidators(): void {
    this.nameControl.setValidators([
      Validators.required,
      Validators.minLength(+this.inputMinLength),
      Validators.maxLength(+this.inputMaxLength),
      checkExist(map(this.list, 'displayText')),
    ]);
  }

  private fillSegmentForm(): void {
    this.list.forEach((item, i) => {
      this.constantGroup.addControl(
        item.count.toString(),
        this.fb.group({
          IR: this.fb.control(item.ir, [
            Validators.required,
            Validators.min(0),
            Validators.max(100),
          ]),
          constant: this.fb.control(item.constant, [
            Validators.required,
            Validators.min(MIN_CONSTANT),
            Validators.max(MAX_CONSTANT),
          ]),
        })
      );
    });
  }

  private fillStatementForm(): void {
    this.list.forEach((item, i) => {
      this.constantGroup.addControl(
        item.count.toString(),
        this.fb.group(
          {
            min: this.fb.control(item.minValue, [
              Validators.required,
              Validators.min(this.minValue),
              Validators.max(this.maxValue),
            ]),
            max: this.fb.control(item.maxValue, [
              Validators.required,
              Validators.min(this.minValue),
              Validators.max(this.maxValue),
            ]),
          },
          {
            validators: [compareNumbers('min', 'max')],
          }
        )
      );
    });
  }

  private initForm(): void {
    switch (this.dataType) {
      case 'Segment':
        this.fillSegmentForm();
        break;
      case 'Statement':
        this.fillStatementForm();
    }
  }
}
