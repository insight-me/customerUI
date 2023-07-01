import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { RoleType, User } from '../../models/user.model';
import { CompanyService } from '../../services/company/company.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MAX_ROOT_ADMINS, ROLES, ROLES_WITHOUT_ROOT_ADMIN } from '../../../../assets/consts/consts';
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../../../../assets/consts/login.consts';
import { InvoiceTable } from '../../models/invoice.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invite-new-user-dialog',
  templateUrl: './invite-new-user-dialog.component.html',
  styleUrls: ['./invite-new-user-dialog.component.scss',  '../confirmation-dialog/confirmation-dialog.component.scss'],
})
export class InviteNewUserDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public user: User;
  public rightOptions = ROLES_WITHOUT_ROOT_ADMIN;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private companyService: CompanyService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
  }

  public ngOnInit(): void {
    this.user = this.config.data?.user;
    if (this.config.data.currentUser.securityLevel === RoleType.Admin) {
      this.rightOptions = this.rightOptions.filter((role) => role.value === 2);
    }
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get formIsInvalid(): boolean {
    return this.form.invalid;
  }

  public onSubmit(): void {
    const payload = this.form.value;
    payload.permission = payload.permission.value;
    if (payload.permission === RoleType.RootAdmin && this.config.data.currentUser.countRootAdmins === MAX_ROOT_ADMINS) {
      this.toastService.showMessage(
        'warn',
        this.translateService.instant('t-toast.Failed'),
        this.translateService.instant('my-profile.max-2-admins'),
      );
      return;
    }
    this.companyService.inviteNewUser(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res) => {
          this.ref.close(res);
        },
        (err) => {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            err.error.title
          );
        }
      );
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  public setErrorMessage(control: string): string {
    const currentControl = this.form?.controls[control] as FormControl;
    if (currentControl.touched && currentControl.invalid) {
      if (currentControl.errors.required) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant(
          'confirm-test.is-requared'
        )}.`;
      }
      if (currentControl.errors.email) {
        return this.translateService.instant(
          't-login-errors.Please, check your e-mail.'
        );
      }
      if (currentControl.errors.minlength) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant(
          'confirm-test.must-be-at-least'
        )} ${
          currentControl.errors.minlength.requiredLength
        } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (currentControl.errors.maxlength) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant(
          'confirm-test.length-must-be-maximum'
        )} ${
          currentControl.errors.maxlength.requiredLength
        } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (currentControl.errors.pattern) {
        return this.translateService.instant(
          't-auth.Password must be at least 8 symbols and contain at least one number, upper and lower case letters and special symbol.'
        );
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      mail: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.minLength(EMAIL_MIN_LENGTH),
          Validators.maxLength(EMAIL_MAX_LENGTH),
        ],
      ],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(NAME_MIN_LENGTH),
          Validators.maxLength(NAME_MAX_LENGTH),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(NAME_MIN_LENGTH),
          Validators.maxLength(NAME_MAX_LENGTH),
        ],
      ],
      permission: [
        this.rightOptions.filter((role) => role.value === 2)[0],
        [Validators.required],
      ],
    });
  }

  public onClose(value: boolean): void {
    this.ref.close(value);
  }
}
