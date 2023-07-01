import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from '../../../shared/services/user/user.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { InvoiceTable } from '../../../shared/models/invoice.model';
import { PASSWORD_PATTERN } from '../../../../assets/consts/consts';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../../../assets/consts/login.consts';
import { mustMatch } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @Output() closeChanges: EventEmitter<void> = new EventEmitter();
  public form: FormGroup;
  public passwordTypeFirst = 'password';
  public passwordTypeSecond = 'password';
  public passwordTypeThird = 'password';
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder,
              public userService: UserService,
              private toastService: ToastService,
              private translateService: TranslateService) {
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onSubmit(): void {
    const payload = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.password,
    };
    this.userService.changePassword(payload)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.toastService.showMessage(
            'success',
            this.translateService.instant('t-toast.Success'),
            this.translateService.instant('t-toast.Password was changed successfully')
          );
          this.closeChanges.emit();
        },
        (err) => {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Change password failed'),
            err.error.title
          );
        }
      );
  }

  public setErrorMessage(control: string): string {
    const currentControl = this.form?.controls[control] as FormControl;
    if (currentControl.touched && currentControl.invalid) {
      if (currentControl.errors.required) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant(
          'confirm-test.is-requared'
        )}.`;
      }
      if (currentControl.errors.minlength) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant(
          'confirm-test.must-be-at-least'
        )} ${
          currentControl.errors.minlength.requiredLength
        } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (currentControl.errors.pattern) {
        return this.translateService.instant(
          't-auth.Password must be at least 8 symbols and contain at least one number, upper and lower case letters and special symbol.'
        );
      }
      if (currentControl.errors.mustMatch) {
        return this.translateService.instant(
          't-auth.Passwords do not match.'
        );
      }
    }
  }

  public onShowPassword(type: string): void {
    switch (type) {
      case 'first': {
        this.passwordTypeFirst =
          this.passwordTypeFirst === 'password' ? 'text' : 'password';
        return;
      }
      case 'second': {
        this.passwordTypeSecond =
          this.passwordTypeSecond === 'password' ? 'text' : 'password';
        return;
      }
      case 'third': {
        this.passwordTypeThird =
          this.passwordTypeThird === 'password' ? 'text' : 'password';
      }
    }
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public onClose(): void {
    this.closeChanges.emit();
  }

  private initForm(): void {
    this.form = this.fb.group(
      {
        oldPassword: [
          '',
          [Validators.required,
            Validators.pattern(PASSWORD_PATTERN),
            Validators.minLength(PASSWORD_MIN_LENGTH),
            Validators.maxLength(PASSWORD_MAX_LENGTH)],
        ],
        password: [
          '',
          [Validators.required,
            Validators.pattern(PASSWORD_PATTERN),
            Validators.minLength(PASSWORD_MIN_LENGTH),
            Validators.maxLength(PASSWORD_MAX_LENGTH)],
        ],
        confirmPassword: [
          '',
          [Validators.required,
            Validators.pattern(PASSWORD_PATTERN),
            Validators.minLength(PASSWORD_MIN_LENGTH),
            Validators.maxLength(PASSWORD_MAX_LENGTH)],
        ],
      },
      {
        validators: [mustMatch('password', 'confirmPassword')],
      }
    );
  }

}
