import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from '../../../shared/enums/toast.type';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  public form: FormGroup;
  public formProcessed = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this._initForm();
  }

  public get isFormInvalid(): boolean {
    return this.form.invalid;
  }

  public onSubmit(): void {
    this.authService.requestResetPassword(this.form.value).subscribe({
      next: () => {
        this.formProcessed = true;
        this.form.reset();
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

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  private _initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }
}
