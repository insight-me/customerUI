import { Injectable } from '@angular/core';
import { SegmentationService } from './segmentation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomSegmentation } from '../../models/custom-segmentation.model';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CreateSegmentationService {
  public segmentation: BehaviorSubject<CustomSegmentation> =
    new BehaviorSubject<CustomSegmentation>(null);
  public isFirstStepDone: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(null);
  public isSecondStepDone: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(null);
  public isThirdStepDone: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(null);
  public questions = [];
  public segments = [];
  public matrixForm: FormGroup = null;

  constructor(
    private segmentationService: SegmentationService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  public setSegmentation(): void {
    this.segmentationService.getCustomSegments().subscribe(
      (segments) => {
        this.questions = segments.questions;
        this.segments = segments.segments;
        this.segmentation.next(segments);
        this.isFirstStepDone.next(segments.segments.length > 0);
        this.isSecondStepDone.next(segments.questions.length > 2);
        if (!segments.coefficients.length) {
          this.isThirdStepDone.next(false);
        } else {
          this.isThirdStepDone.next(
            segments.coefficients.length ===
              segments.segments.length * segments.questions.length
          );
        }
      },
      (err) => {
        this.toastService.showMessage(
          'warn',
          this.translateService.instant('t-toast.Failed'),
          err.error.title
        );
      }
    );
  }

  public getSegmentation(): Observable<CustomSegmentation> {
    return this.segmentation.asObservable();
  }

  public getIsFirstStepDone(): Observable<boolean> {
    return this.isFirstStepDone.asObservable();
  }

  public getIsSecondStepDone(): Observable<boolean> {
    return this.isSecondStepDone.asObservable();
  }

  public getIsThirdStepDone(): Observable<boolean> {
    return this.isThirdStepDone.asObservable();
  }
}
