import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ListItem } from '../../../../../shared/models/test.model';
import { THEY, THEY_SE } from '../../../../../../assets/consts/consts';
import { RespondentsService } from '../../../bic-create/services/respondents.service';

@Component({
  selector: 'app-gender-form',
  templateUrl: './gender-form.component.html',
  styleUrls: ['./gender-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderFormComponent {
  @Input() set respondentOptions(options) {
    this.genders = options?.genders.filter(
      (gender) => gender.value !== THEY && gender.value !== THEY_SE
    );
  }

  public genders: ListItem[] = [];

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private bicRespondentsService: RespondentsService) {}

  public get genderControl(): FormControl {
    return this.bicRespondentsService.genderControl;
  }

  public onChangeGenders(): void {
    this.bicRespondentsService.updateGenders();
  }
}
