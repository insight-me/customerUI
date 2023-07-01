import { Component, Input } from '@angular/core';
import { RespondentRequirements } from '../../../../../shared/models/test.model';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MAX_RESP_NUMBER_BIC } from '../../../../../../assets/consts/test-creation.const';
import { Observable } from 'rxjs';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';
import { SegmentationTypes } from '../../../enums/segmentation.type';
import { ONLY_INTEGERS_ARRAY } from '../../../../../../assets/consts/consts';

@Component({
  selector: 'app-resp-number-container',
  templateUrl: './resp-number-container.component.html',
  styleUrls: ['./resp-number-container.component.scss'],
})
export class RespNumberContainerComponent {
  @Input() respondentRequirements: RespondentRequirements;

  constructor(private bicRespondentsService: RespondentsService) {}

  public get maxNumberOfRespondents(): number {
    return this.bicRespondentsService.maxNumberOfRespondents;
  }

  public get numberOfRespondentsControl(): FormControl {
    return this.bicRespondentsService.numberOfRespondentsControl;
  }

  public get segmentsForm(): FormArray {
    return this.bicRespondentsService.segmentsForm;
  }

  public get hasSummError$(): Observable<boolean> {
    return this.bicRespondentsService.hasSummError$;
  }

  public get populationCount$(): Observable<number> {
    return this.bicRespondentsService.populationCount$;
  }

  public get minNumberOfRespondents$(): Observable<number> {
    return this.bicRespondentsService.minNumberOfRespondents$;
  }

  public get isAllSegments$(): Observable<boolean> {
    return this.bicRespondentsService.isAllSegments$;
  }

  public get noSegments(): boolean {
    return (
      this.bicRespondentsService.segmentTypeControl.value ===
      SegmentationTypes.NoSegments
    );
  }

  public convertToFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  public controlHasError(control): boolean {
    return control.touched && control.invalid;
  }

  public numberOnly(event: KeyboardEvent): boolean {
    return ONLY_INTEGERS_ARRAY.includes(event.key);
  }

  public setZero(event: Event, control: FormControl): void {
    TestCreationUtils.setZero(event, control);
    this.bicRespondentsService.updateCountryNumberOfRespondents();
  }
}
