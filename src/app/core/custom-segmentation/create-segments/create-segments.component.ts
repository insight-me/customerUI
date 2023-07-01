import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  CustomSegments,
  MySegmentsList,
  UpsetSegments,
} from '../../../shared/models/custom-segmentation.model';
import {
  MAX_CONSTANT,
  MIN_CONSTANT,
} from '../../../../assets/consts/segmentation.consts';
import { CONSTANT_PATTERN } from '../../../../assets/consts/consts';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { cloneDeep, differenceBy, omit } from 'lodash';
import { CreateSegmentationService } from '../../../shared/services/segmentation/create-segmentation.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-segments',
  templateUrl: './create-segments.component.html',
  styleUrls: [
    './create-segments.component.scss',
    '../create-segmentation/create-segmentation.component.scss',
  ],
})
export class CreateSegmentsComponent implements OnDestroy {
  @Input() public isEditMode: boolean;

  @Input()
  public set customSegments(data: CustomSegments) {
    if (data) {
      this.initialSegments = cloneDeep(data);
      this.segments.segments = data.segments;
    }
  }

  @Output() public goToNext = new EventEmitter();
  @Output() public cancelChanges = new EventEmitter();
  public segments: UpsetSegments = { segments: [] };
  private initialSegments: CustomSegments;
  private sub: Subscription = new Subscription();

  constructor(
    private segmentationService: SegmentationService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private createSegmentationService: CreateSegmentationService
  ) {}

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public updateSegments(segments: MySegmentsList[]): void {
    const arrayForUpset = [];
    segments.forEach((segment) => {
      const elem = omit(segment, 'count');
      arrayForUpset.push(elem);
    });
    this.segments.segments = arrayForUpset;
    this.createSegmentationService.segments = arrayForUpset;
  }

  public getTooltip(): string {
    if (!this.segments.segments?.length) {
      return 'segmentation.add-segment-error';
    } else {
      return 'segmentation.add-constant-error';
    }
  }

  public getDisabledStatus(): boolean {
    if (!this.segments.segments?.length) {
      this.createSegmentationService.isFirstStepDone.next(false);
      return true;
    }
    let isFalse = false;
    this.segments.segments.forEach((segment) => {
      if (
        segment.constant == null ||
        segment.constant < MIN_CONSTANT ||
        segment.constant > MAX_CONSTANT ||
        !CONSTANT_PATTERN.test(segment.constant.toString()) ||
        segment.ir < 0 ||
        segment.ir > 100 ||
        segment.ir == null ||
        segment.ir.toString() === ''
      ) {
        isFalse = true;
        return;
      }
    });
    if (isFalse) {
      this.createSegmentationService.isFirstStepDone.next(false);
    } else {
      this.createSegmentationService.isFirstStepDone.next(true);
    }
    return isFalse;
  }

  public goToNextStep(): void {
    if (
      differenceBy(
        this.initialSegments.segments,
        this.segments.segments,
        'displayText'
      ).length ||
      differenceBy(
        this.initialSegments.segments,
        this.segments.segments,
        'constant'
      ).length ||
      differenceBy(this.initialSegments.segments, this.segments.segments, 'ir')
        .length ||
      differenceBy(this.segments.segments, this.initialSegments.segments, 'ir')
        .length ||
      differenceBy(
        this.segments.segments,
        this.initialSegments.segments,
        'displayText'
      ).length ||
      differenceBy(
        this.segments.segments,
        this.initialSegments.segments,
        'constant'
      ).length
    ) {
      this.sub = this.segmentationService
        .upsertCustomSegments(this.segments)
        .subscribe(
          (res) => {
            this.createSegmentationService.setSegmentation();
            this.goToNext.emit();
          },
          (err) => {
            this.toastService.showMessage(
              'warn',
              this.translateService.instant('t-toast.Failed'),
              this.translateService.instant('segmentation.can-not-change')
            );
          }
        );
    } else {
      this.goToNext.emit();
    }
  }
}
