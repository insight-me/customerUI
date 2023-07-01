import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,

  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { tap } from 'rxjs/operators';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { SegmentationService } from 'src/app/shared/services/segmentation/segmentation.service';
import { CONSTANT_PATTERN } from '../../../../assets/consts/consts';
import {
  MAX_CONSTANT,
  MAX_PROGRESS,
  MAX_STATEMENT,
  MIN_CONSTANT,
  MIN_STATEMENT
} from '../../../../assets/consts/segmentation.consts';
import { SEGMENTATION_NAV } from '../../../../assets/consts/test-creation.const';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CustomSegments } from '../../../shared/models/custom-segmentation.model';
import { DialogFactoryService } from '../../../shared/services/dialog/dialog-factory.service';
import { CreateSegmentationService } from '../../../shared/services/segmentation/create-segmentation.service';
import { changeMetaToDesktop } from '../../../shared/utils/change-meta.utils';

enum SegmentationSteps {
  Segments,
  Scales,
  Questions,
  Matrix,
}

@UntilDestroy()
@Component({
  selector: 'app-create-segmentation',
  templateUrl: './create-segmentation.component.html',
  styleUrls: ['./create-segmentation.component.scss'],
  providers: [DialogService],
})
export class CreateSegmentationComponent
  implements OnInit, AfterViewInit {
  @ViewChild('createSegmentation') public createSegmentation: ElementRef;
  public navItems = SEGMENTATION_NAV;
  public step = 1;
  public customSegments: CustomSegments = {} as CustomSegments;
  public isEditMode = false;
  public isAlertExist = true;


  constructor(
    public createSegmentationService: CreateSegmentationService,
    private segmentationService: SegmentationService,
    private dialogFactoryService: DialogFactoryService,
    private translateService: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.createSegmentationService.setSegmentation();
    this.getCustomSegments();
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  public closeAlert(): void {
    this.isAlertExist = false;
    this.createSegmentation.nativeElement.classList.remove('show');
    changeMetaToDesktop();
  }

  public goToNext(): void {
    this.step += 1;
  }

  public setCustomSegmentationMinMaxValue(values: number[]): void {
    this.segmentationService.setCustomSegmentationMinMaxValue({ minValue: values[0], maxValue: values[1] })
      .pipe(tap(() => {
        this.step += 1;
        this.getCustomSegments();
      }))
      .subscribe();
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public cancelChanges(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        showHeader: false,
        width: '360px',
        data: {
          header: this.translateService.instant('segmentation.cancel-changes'),
          text: this.translateService.instant('segmentation.cancel-text'),
          btn: this.translateService.instant('additional.yes'),
          btnNo: this.translateService.instant('additional.no'),
        },
      });
      ref.onClose
        .pipe(untilDestroyed(this))
        .subscribe((res) => {
          if (res) {
            this.router.navigate(['personal-area/custom-segmentation']);
          }
        });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public getProgressWidth(step: number): number {
    switch (step) {
      /** Segments */
      case SegmentationSteps.Segments:
        const segmentsArr = this.createSegmentationService.segments.filter(
          (segment) =>
            segment.constant &&
            segment.constant >= MIN_CONSTANT &&
            segment.constant <= MAX_CONSTANT &&
            CONSTANT_PATTERN.test(segment.constant.toString()) &&
            segment.ir >= 0 &&
            segment.ir <= 100 &&
            segment.ir.toString() !== ''
        );
        if (!segmentsArr.length) {
          return 0;
        }
        return segmentsArr.length &&
          segmentsArr.length === this.createSegmentationService.segments.length
          ? MAX_PROGRESS
          : (MAX_PROGRESS / this.createSegmentationService.segments.length) *
          segmentsArr.length;
      /** Questions */
      case SegmentationSteps.Questions:
        const questionsArr = this.createSegmentationService.questions.filter(
          (question) =>
            question.minValue &&
            question.maxValue &&
            question.minValue >= MIN_STATEMENT &&
            question.maxValue <= MAX_STATEMENT &&
            question.maxValue >= question.minValue
        );
        return questionsArr.length < 3
          ? (MAX_PROGRESS / 3) * questionsArr.length
          : (MAX_PROGRESS / this.createSegmentationService.questions.length) *
          questionsArr.length;
      /** Matrix */
      case SegmentationSteps.Matrix:
        if (!this.createSegmentationService.matrixForm) {
          return this.customSegments.segments?.length *
            this.customSegments.questions?.length ===
            this.customSegments.coefficients?.length
            ? MAX_PROGRESS
            : (MAX_PROGRESS / this.customSegments.segments?.length) *
            this.customSegments.questions?.length *
            this.customSegments.coefficients?.length;
        } else {
          const numOfCell =
            this.createSegmentationService.segments?.length *
            this.createSegmentationService.questions?.length;
          let correctCells = 0;
          Object.keys(
            this.createSegmentationService.matrixForm.controls
          ).forEach((control) => {
            if (
              this.createSegmentationService.matrixForm.controls[control].valid
            ) {
              correctCells++;
            }
          });
          return numOfCell === correctCells
            ? MAX_PROGRESS
            : (MAX_PROGRESS / numOfCell) * correctCells;
        }
    }
  }

  public isScaleDone(step: number): boolean {
    if (step !== 1) {
      return;
    }

    return (step === 1 && (!!this.customSegments.minValue && !!this.customSegments.maxValue))
  }

  public isDone(step: number): boolean {
    return this.getProgressWidth(step) === MAX_PROGRESS;
  }

  private getCustomSegments(): void {
    this.createSegmentationService
      .getSegmentation()
      .pipe(untilDestroyed(this))
      .subscribe((segments) => {
        if (segments) {
          this.customSegments = segments;
          if (this.customSegments.coefficients.length) {
            this.isEditMode = true;
          }
        }
      });
  }
}
