import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/services/app-state/local-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { omit } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { DialogFactoryService } from 'src/app/shared/services/dialog/dialog-factory.service';
import { PASSWORD_PATTERN } from 'src/assets/consts/consts';
import { EMAIL_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/assets/consts/login.consts';
import { IconsType } from '../../../shared/enums/icons.type';
import { ToastType } from '../../../shared/enums/toast.type';
import { InputType } from '../../../shared/enums/auth.type';
import { ErrorStatusCode } from '../../../shared/enums/responce-status.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public passwordType = InputType.Password;

  private _id = '';
  private _confirmationCode = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private userService: UserService,
    private appStateService: AppStateService,
    private dialogFactoryService: DialogFactoryService
  ) {}

  public ngOnInit(): void {
    this._checkIfNeedConformEmail();
  }

  public get isFormInvalid(): boolean {
    return this.form.invalid;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get isTextTypePassword(): boolean {
    return this.passwordType === InputType.Text;
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public onShowPassword(): void {
    this.passwordType =
      this.passwordType === InputType.Password
        ? InputType.Text
        : InputType.Password;
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public getErrorMessage(control: string): string {
    if (this.form.controls[control].errors?.required) {
      return 't-auth.Password can not be empty.';
    }
    if (this.form.controls[control].errors?.pattern) {
      return 't-auth.Password must be at least 8 symbols and contain at least one number, upper and lower case letters and special symbol.';
    }
  }

  public onSubmit(): void {
    this.authService
      .login(omit(this.form.value, ['rememberMe']))
      .pipe(
        mergeMap((res) => {
          this.localStorageService.set(res);
          this.authService.startRefreshTokenTimer();
          return this.userService.getUserInfo();
        })
      )
      .subscribe({
        next: (user) => {
          this.appStateService.setCurrentUser(user);
          this.router.navigate(['personal-area/dashboard']);
        },
        error: (err) => {
          const errorTitle =
            err.status === ErrorStatusCode.NotFound
              ? this.translateService.instant('t-auth.Login failed.')
              : this.translateService.instant('t-auth.Login failed.');
          const errorText =
            err.status === ErrorStatusCode.NotFound
              ? err.error.title
              : this.translateService.instant(
                  't-auth.There was an unknown error. Please, try again.'
                );
          this.toastService.showMessage(
            ToastType.Warning,
            errorTitle,
            errorText
          );
        },
      });
  }

  private _checkIfNeedConformEmail(): void {
    this.dialogFactoryService.closeOpenDialogs();
    this._id = this.route.snapshot.queryParams.Id;
    this._confirmationCode = this.route.snapshot.queryParams.ConfirmationCode;
    if (this._id && this._confirmationCode) {
      this._confirmEmail();
    }
    this._initForm();
  }

  private _confirmEmail(): void {
    this.authService
      .verifyEmail({ id: this._id, ConfirmationCode: this._confirmationCode })
      .subscribe({
        next: () => {
          this.toastService.showMessage(
            ToastType.Success,
            this.translateService.instant('t-toast.Success'),
            this.translateService.instant(
              't-auth.E-mail is successfully confirmed.'
            )
          );
        },
        error: (err) => {
          this.toastService.showMessage(
            ToastType.Warning,
            this.translateService.instant('t-toast.Failed'),
            err.error.title
          );
        },
      });
  }

  private _initForm(): void {
    this.form = this.fb.group({
      mail: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.minLength(EMAIL_MIN_LENGTH),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          Validators.maxLength(PASSWORD_MAX_LENGTH),
          Validators.pattern(PASSWORD_PATTERN),
        ],
      ],
      rememberMe: [false],
    });
  }
}
