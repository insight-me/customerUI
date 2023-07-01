import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { cloneDeep, differenceBy } from 'lodash';
import { Subscription } from 'rxjs';
import { MAX_STATEMENT, MAX_STATEMENTS, MIN_STATEMENT } from '../../../../assets/consts/segmentation.consts';
import { CustomSegments, SegmentQuestion, UpsetSegmentationQuestions } from '../../../shared/models/custom-segmentation.model';
import { CreateSegmentationService } from '../../../shared/services/segmentation/create-segmentation.service';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';

@Component({
  selector: 'app-create-questions',
  templateUrl: './create-questions.component.html',
  styleUrls: ['./create-questions.component.scss', '../create-segmentation/create-segmentation.component.scss']
})
export class CreateQuestionsComponent implements OnDestroy {
  @Input() public isEditMode: boolean;
  @Input() public minValue: number;
  @Input() public maxValue: number;
  @Input()
  private set customSegments(data: CustomSegments) {
    if (data) {
      this.initialQuestions = cloneDeep(data);
      this.questions.questions = data.questions;
    }
  }

  @Output() public goToNext = new EventEmitter();
  @Output() public cancelChanges = new EventEmitter();
  public questions: UpsetSegmentationQuestions = { questions: [] };
  private initialQuestions: CustomSegments;
  private sub: Subscription = new Subscription();

  constructor(private segmentationService: SegmentationService,
    private createSegmentationService: CreateSegmentationService) {
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public updateQuestions(questions: SegmentQuestion[]): void {
    this.questions.questions = questions;
    this.createSegmentationService.questions = questions;
  }

  public getTooltip(): string {
    if (this.questions.questions.length < MAX_STATEMENTS) {
      return 'segmentation.add-question-error';
    } else {
      return 'segmentation.add-min-max-error';
    }
  }

  public getDisabledStatus(): boolean {
    if (this.questions?.questions?.length < MAX_STATEMENTS) {
      this.createSegmentationService.isSecondStepDone.next(false);
      return true;
    }
    let isFalse = false;
    this.questions.questions.forEach((question) => {
      if (question.minValue == null
        || question.maxValue == null
        || question.minValue < MIN_STATEMENT
        || question.minValue === question.maxValue
        || question.maxValue > MAX_STATEMENT
        || question.maxValue < question.minValue) {
        isFalse = true;
        return;
      }
    });
    if (isFalse) {
      this.createSegmentationService.isSecondStepDone.next(false);
    } else {
      this.createSegmentationService.isSecondStepDone.next(true);
    }
    return isFalse;
  }

  public goToNextStep(): void {
    if (differenceBy(this.initialQuestions.questions, this.questions.questions, 'displayText').length
      || differenceBy(this.initialQuestions.questions, this.questions.questions, 'minValue').length
      || differenceBy(this.questions.questions, this.initialQuestions.questions, 'displayText').length
      || differenceBy(this.questions.questions, this.initialQuestions.questions, 'minValue').length
      || differenceBy(this.initialQuestions.questions, this.questions.questions, 'maxValue').length
      || differenceBy(this.questions.questions, this.initialQuestions.questions, 'maxValue').length) {
      this.sub = this.segmentationService.upsertCustomSegmentQuestions(this.questions).subscribe((res) => {
        this.createSegmentationService.setSegmentation();
        this.goToNext.emit();
      });
    } else {
      this.goToNext.emit();
    }
  }

}
