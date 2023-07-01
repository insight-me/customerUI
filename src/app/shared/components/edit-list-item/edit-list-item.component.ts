import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {Association} from '../../models/test.model';
import {FormControl, Validators} from '@angular/forms';
import {INPUT_MIN_LENGTH, TEST_NAME_MAX_LENGTH} from '../../../../assets/consts/consts';
import {TranslateService} from '@ngx-translate/core';
import {checkExist} from '../../validators/check-exist.validator';
import {map} from 'lodash';
import {BtCustomAssociation, BtTestAssociation} from '../../models/bt-test.model';

@Component({
  selector: 'app-edit-list-item',
  templateUrl: './edit-list-item.component.html',
  styleUrls: ['./edit-list-item.component.scss']
})
export class EditListItemComponent implements AfterViewInit {
  @Input() association: Association | BtCustomAssociation;
  @Input() private associations: Association[] | (BtTestAssociation | BtCustomAssociation)[];
  @Input() hideAdditional = false;
  @Output() cancelEditMode: EventEmitter<void> = new EventEmitter();
  @Output() editAssociation: EventEmitter<string> = new EventEmitter();
  public editFormControl: FormControl;
  private initText = '';

  constructor(private translateService: TranslateService, private changeDetector: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.editFormControl = new FormControl(this.association.value,
      [Validators.required,
        Validators.minLength(INPUT_MIN_LENGTH),
        Validators.maxLength(TEST_NAME_MAX_LENGTH),
        checkExist(map(this.associations, 'value')),
        checkExist(map(this.associations, 'text'))]);
    this.initText = this.association.value ? this.association.value : this.association.text;
    this.changeDetector.detectChanges();
  }

  public getError(error): string {
    if (error.minlength || error.maxlength || error.required) {
      return this.translateService.instant('test-concept.error-length', {
        dataType: 'Association',
        min: INPUT_MIN_LENGTH,
        max: TEST_NAME_MAX_LENGTH,
      });
    } else {
      return this.translateService.instant(
        'test-concept.error-exist-association'
      );
    }
  }

  public isDisabledSaveButton(): boolean {
    return this.editFormControl.invalid || this.initText === this.editFormControl.value;
  }

  public editValue(): void {
    this.editAssociation.emit(this.editFormControl.value);
  }
}
