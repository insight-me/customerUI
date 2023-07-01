import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RespondentsService } from '../../../bic-create/services/respondents.service';
import { MIN_AGE_SPAN } from '../../../../../../assets/consts/test-creation.const';
import { MAX_AGE } from 'src/assets/consts/consts';

@Component({
  selector: 'app-age-form',
  templateUrl: './age-form.component.html',
  styleUrls: ['./age-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeFormComponent {
  constructor(private bicRespondentsService: RespondentsService) {}

  public get minAge(): FormControl {
    return this.bicRespondentsService.minAgeControl;
  }

  public get maxAge(): FormControl {
    return this.bicRespondentsService.maxAgeControl;
  }

  public get isMaxAgeMax(): boolean {
    return this.minAge.value && this.minAge.valid && this.minAge.value + MIN_AGE_SPAN === MAX_AGE;
  }

  public onChangeMinAge(): void {
    this.bicRespondentsService.updateMinAge();
  }

  public onChangeMaxAge(): void {
    this.bicRespondentsService.updateMaxAge();
  }
}
