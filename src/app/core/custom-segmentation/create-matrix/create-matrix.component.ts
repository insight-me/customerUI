import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CustomSegments } from '../../../shared/models/custom-segmentation.model';
import { cloneDeep } from 'lodash';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAX_INDEX,
  MIN_INDEX,
} from '../../../../assets/consts/segmentation.consts';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { Router } from '@angular/router';
import { CreateSegmentationService } from '../../../shared/services/segmentation/create-segmentation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-matrix',
  templateUrl: './create-matrix.component.html',
  styleUrls: [
    './create-matrix.component.scss',
    '../create-segmentation/create-segmentation.component.scss',
  ],
})
export class CreateMatrixComponent implements OnDestroy {
  @Input()
  public set customSegments(data: CustomSegments) {
    if (data) {
      this.initialMatrix = cloneDeep(data);
      this.segmentation = data;
      this.initForm();
    }
  }

  @Output() public cancelChanges = new EventEmitter();
  @Input() public viewOnly = false;
  @Input() public isEditMode: boolean;
  public segmentation: CustomSegments;
  public form: FormGroup;
  private initialMatrix: CustomSegments;
  private sub: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private segmentationService: SegmentationService,
    private createSegmentationService: CreateSegmentationService,
    private router: Router
  ) {}

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public getTemplateClass(length: number): string {
    return `template-${length}`;
  }

  public getDisabledStatus(): boolean {
    this.form.invalid
      ? this.createSegmentationService.isThirdStepDone.next(false)
      : this.createSegmentationService.isThirdStepDone.next(true);
    return this.form.invalid;
  }

  public saveSegmentation(): void {
    this.sub = this.segmentationService
      .upsertCustomSegmentCoefficients({
        coefficients: this.segmentation.coefficients,
      })
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['personal-area/custom-segmentation']);
        }
      });
  }

  public saveIndex(questionId: string, segmentId: string): void {
    const control = this.getControl(questionId, segmentId);
    if (control.value) {
      const withoutLetters = control.value.replace(/[^0-9.,-]/g, '');
      control.setValue(withoutLetters);
    }
    if (control.value?.toString().includes(',')) {
      const newNum = control.value.replace(',', '.');
      control.setValue(+newNum);
    }
    if (control.value?.toString().split('.')?.length > 1) {
      if (control.value?.toString().split('.')[1].length > 3) {
        const num = `${control.value?.toString().split('.')[0]}.${control.value
          ?.toString()
          .split('.')[1]
          .substr(0, 3)}`;
        control.setValue(+num);
      }
    }
    const index = this.segmentation.coefficients.findIndex(
      (item) =>
        item.customSegmentId === segmentId &&
        item.customSegmentationQuestionId === questionId
    );
    this.segmentation.coefficients[index].value = control.value;
  }

  public getIndex(questionId: string, segmentId: string): number {
    const index = this.segmentation.coefficients.findIndex(
      (item) =>
        item.customSegmentId === segmentId &&
        item.customSegmentationQuestionId === questionId
    );
    return this.segmentation.coefficients[index].value;
  }

  public getControl(questionId: string, segmentId: string): FormControl {
    const name = `${questionId}-${segmentId}`;
    return this.form.controls[name] as FormControl;
  }

  private initForm(): void {
    this.form = this.fb.group({});
    this.segmentation.questions.forEach((question) => {
      this.segmentation.segments.forEach((segment) => {
        const index = this.segmentation.coefficients.findIndex(
          (item) =>
            item.customSegmentId === segment.id &&
            item.customSegmentationQuestionId === question.id
        );
        this.form.addControl(
          `${question.id}-${segment.id}`,
          this.fb.control(
            this.segmentation.coefficients[index]?.value ||
              this.segmentation.coefficients[index]?.value === 0
              ? this.segmentation.coefficients[index]?.value
              : null,
            [
              Validators.required,
              Validators.min(MIN_INDEX),
              Validators.max(MAX_INDEX),
            ]
          )
        );
        if (
          !this.segmentation.coefficients.filter(
            (item) =>
              item.customSegmentId === segment.id &&
              item.customSegmentationQuestionId === question.id
          ).length
        ) {
          this.segmentation.coefficients.push({
            customSegmentId: segment.id,
            customSegmentationQuestionId: question.id,
            value: null,
          });
        }
      });
    });
    this.createSegmentationService.matrixForm = this.form;
  }
}
