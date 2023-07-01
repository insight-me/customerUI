import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InvoiceTable } from '../../models/invoice.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent {
  @Input() placeholder = '';
  @Input() control: FormControl;
  @Input() controlName = '';
  @Input() errors: { [index: string]: string } = null;
  @Input() maxLength = 100000000000;
  @Input() type = 'text';
  @Input() isMainPage = false;
  @Input() isPhone = false;
  @Input() errorColor = '#ff6f6f';

  public address: any = {};

  constructor(private translateService: TranslateService) {}

  public controlHasError(): boolean {
    return this.control?.touched && this.control?.invalid;
  }

  public getErrorMessage(): string {
    return this.errors[Object.keys(this.control.errors)[0]];
  }

  public setErrorMessage(): string {
    if (this.control.touched && this.control.invalid) {
      if (this.control.errors.required) {
        return `${this.translateService.instant(
          InvoiceTable[this.controlName] || this.controlName
        )} ${this.translateService.instant('confirm-test.is-requared')}.`;
      }
      if (this.control.errors.minlength) {
        return `${this.translateService.instant(
          InvoiceTable[this.controlName] || this.controlName
        )} ${this.translateService.instant('confirm-test.must-be-at-least')} ${
          this.control.errors.minlength.requiredLength
        } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (this.control.errors.maxlength) {
        return `${this.translateService.instant(
          InvoiceTable[this.controlName] || this.controlName
        )} ${this.translateService.instant(
          'confirm-test.length-must-be-maximum'
        )} ${
          this.control.errors.maxlength.requiredLength
        } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (this.control.errors.email) {
        return 't-login-errors.Please, check your e-mail.';
      }
    }
  }

  public trimValue(value: string): void {
    this.control.setValue(value.trim());
  }
}
