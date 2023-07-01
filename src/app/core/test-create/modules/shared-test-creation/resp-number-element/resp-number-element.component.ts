import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';
import { ONLY_INTEGERS_ARRAY } from '../../../../../../assets/consts/consts';

@Component({
  selector: 'app-resp-number-element',
  templateUrl: './resp-number-element.component.html',
  styleUrls: ['./resp-number-element.component.scss'],
})
export class RespNumberElementComponent {
  constructor(private bicRespondentsService: RespondentsService) {}

  public get segmentForm(): FormArray {
    return this.bicRespondentsService.segmentsForm;
  }

  public controlHasError(control): boolean {
    return control.invalid;
  }

  public convertToFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  public convertToFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  public updateValue(event: Event, control): void {
    TestCreationUtils.setZero(event, control);
    this.bicRespondentsService.updateRespondentCountPerSegment();
  }

  public numberOnly(event: KeyboardEvent): boolean {
    return ONLY_INTEGERS_ARRAY.includes(event.key);
  }
}
