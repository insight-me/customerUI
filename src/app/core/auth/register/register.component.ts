import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { PASSWORD_PATTERN } from 'src/assets/consts/consts';
import { TranslateService } from '@ngx-translate/core';
import { mustMatch } from 'src/app/shared/validators/password-match.validator';
import { omit } from 'lodash';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import {
  CITY_MAX_LENGTH,
  CITY_MIN_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  COMPANY_NAME_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  POSTAL_CODE_MAX_LENGTH,
  POSTAL_CODE_MIN_LENGTH,
  STREET_MAX_LENGTH,
  STREET_MIN_LENGTH
} from 'src/assets/consts/login.consts';
import { InvoiceTable } from 'src/app/shared/models/invoice.model';
import { IconsType } from '../../../shared/enums/icons.type';
import { DialogFactoryService } from '../../../shared/services/dialog/dialog-factory.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LegalComponent } from '../../../shared/legal/legal/legal.component';
import { InputType } from 'src/app/shared/enums/auth.type';
import { ToastType } from '../../../shared/enums/toast.type';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public passwordTypeFirst: InputType = InputType.Password;
  public passwordTypeSecond: InputType = InputType.Password;
  public formProcessed = false;

  constructor(
    public appStateService: AppStateService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private dialogFactoryService: DialogFactoryService
  ) {}

  public ngOnInit(): void {
    this._initForm();
  }

  public get isFormInvalid(): boolean {
    return this.form.invalid;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get isTextTypePassword(): boolean {
    return this.passwordTypeFirst === InputType.Text;
  }

  public get isTextTypeConfirmPassword(): boolean {
    return this.passwordTypeSecond === InputType.Text;
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
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

  public setErrorMessage(control: string): string {
    const currentControl = this.form?.controls[control] as FormControl;
    if (currentControl.touched && currentControl.invalid) {
      if (currentControl.errors.required) {
        return `${this.translateService.instant(
          InvoiceTable[control]
        )} ${this.translateService.instant('confirm-test.is-requared')}.`;
      }
      if (currentControl.errors.minlength) {
        return `${this.translateService.instant(
          InvoiceTable[control]
        )} ${this.translateService.instant('confirm-test.must-be-at-least')} ${
          currentControl.errors.minlength.requiredLength
        } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (currentControl.errors.pattern) {
        return this.translateService.instant(
          't-auth.Password must be at least 8 symbols and contain at least one number, upper and lower case letters and special symbol.'
        );
      }
      if (currentControl.errors.mustMatch) {
        return this.translateService.instant('t-auth.Passwords do not match.');
      }
    }
  }

  public openPP(isPrivacy: boolean, isTerms: boolean): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(LegalComponent, {
        showHeader: false,
        height: '100%',
        data: {
          isPrivacy,
          isTerms,
        },
      });
      ref.onClose.subscribe(() => {});
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public onSubmit(): void {
    const payload = omit(this.form.value, [
      'confirmPassword',
      'acceptPP',
      'acceptTC',
      'acceptAge',
    ]);
    payload.companyCountry =
      this.form.controls.companyCountry.value.countryCode;
    this.authService.registerUser(payload).subscribe(
      () => {
        this.formProcessed = true;
        this.form.reset();
      },
      (err) => {
        this.toastService.showMessage(
          ToastType.Warning,
          this.translateService.instant('t-auth.Registration failed.'),
          err.error.title
        );
      }
    );
  }

  private _initForm(): void {
    this.form = this.fb.group(
      {
        mail: [
          '',
          [
            Validators.email,
            Validators.required,
            Validators.minLength(EMAIL_MIN_LENGTH),
            Validators.maxLength(EMAIL_MAX_LENGTH),
          ],
        ],
        companyOrgNumber: ['', [Validators.required]],
        vatNumber: [''],
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
          ],
        ],
        preferredLanguage: ['', [Validators.required]],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
          ],
        ],
        companyName: [
          '',
          [
            Validators.required,
            Validators.minLength(COMPANY_NAME_MIN_LENGTH),
            Validators.maxLength(COMPANY_NAME_MAX_LENGTH),
          ],
        ],
        companyCountry: ['', [Validators.required]],
        contactName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
          ],
        ],
        contactSurname: [
          '',
          [
            Validators.required,
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
          ],
        ],
        contactMail: [
          '',
          [
            Validators.email,
            Validators.required,
            Validators.minLength(EMAIL_MIN_LENGTH),
            Validators.maxLength(EMAIL_MAX_LENGTH),
          ],
        ],
        companyStreet: [
          '',
          [
            Validators.required,
            Validators.minLength(STREET_MIN_LENGTH),
            Validators.maxLength(STREET_MAX_LENGTH),
          ],
        ],
        companyPostalCode: [
          '',
          [
            Validators.required,
            Validators.minLength(POSTAL_CODE_MIN_LENGTH),
            Validators.maxLength(POSTAL_CODE_MAX_LENGTH),
          ],
        ],
        companyCity: [
          '',
          [
            Validators.required,
            Validators.minLength(CITY_MIN_LENGTH),
            Validators.maxLength(CITY_MAX_LENGTH),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(PASSWORD_PATTERN),
            Validators.minLength(PASSWORD_MIN_LENGTH),
            Validators.maxLength(PASSWORD_MAX_LENGTH),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(PASSWORD_PATTERN),
            Validators.minLength(PASSWORD_MIN_LENGTH),
            Validators.maxLength(PASSWORD_MAX_LENGTH),
          ],
        ],
        acceptPP: [false, [Validators.requiredTrue]],
        acceptTC: [false, [Validators.requiredTrue]],
        acceptAge: [false, [Validators.requiredTrue]],
      },
      {
        validators: [mustMatch('password', 'confirmPassword')],
      } as AbstractControlOptions
    );
  }
}
