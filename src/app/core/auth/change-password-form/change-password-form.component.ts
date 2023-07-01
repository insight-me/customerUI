import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { mustMatch } from 'src/app/shared/validators/password-match.validator';
import { PASSWORD_PATTERN } from 'src/assets/consts/consts';
import { InputType } from '../../../shared/enums/auth.type';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['../login/login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent implements OnInit {
  @Input() title = '';

  @Output() onSubmitForm = new EventEmitter<string>();

  public form: FormGroup = null;
  public passwordTypeFirst: InputType = InputType.Password;
  public passwordTypeSecond: InputType = InputType.Password;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this._initForm();
  }

  public get isFormInvalid(): boolean {
    return (
      this.form.invalid &&
      this.form.controls.password !== this.form.controls.confirmPassword
    );
  }

  public get isTextTypePassword(): boolean {
    return this.passwordTypeFirst === InputType.Text;
  }

  public get isTextTypeConfirmPassword(): boolean {
    return this.passwordTypeSecond === InputType.Text;
  }

  public onSubmit(): void {
    this.onSubmitForm.emit(this.form.value.password);
  }

  public onShowPassword(): void {
    this.passwordTypeFirst =
      this.passwordTypeFirst === InputType.Password
        ? InputType.Text
        : InputType.Password;
  }

  public onShowConfirmPassword(): void {
    this.passwordTypeSecond =
      this.passwordTypeSecond === InputType.Password
        ? InputType.Text
        : InputType.Password;
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public getErrorMessage(control: string): string {
    if (control === 'password') {
      const error = this.form.controls.password.errors;
      if (error.pattern) {
        return 't-auth.Password must be at least 8 symbols and contain at least one number, upper and lower case letters and special symbol.';
      }
      if (error.required) {
        return 't-auth.Password can not be empty.';
      }
      return 't-auth.Password is invalid.';
    } else {
      return 't-auth.Passwords do not match.';
    }
  }

  private _initForm(): void {
    this.form = this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
        ],
        confirmPassword: [
          '',
          [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
        ],
      },
      {
        validators: [mustMatch('password', 'confirmPassword')],
      } as AbstractControlOptions
    );
  }
}
