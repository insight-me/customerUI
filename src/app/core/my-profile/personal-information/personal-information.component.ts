import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { RoleType, User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/app-state/local-storage.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogFactoryService } from 'src/app/shared/services/dialog/dialog-factory.service';
import { LanguagesEnum } from '../../../shared/configs/translate.config';
import { merge } from 'lodash';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DEBOUNCE_TIME_FOR_INPUT, INPUT_MIN_LENGTH__PASSWORD, TEST_NAME_MAX_LENGTH } from '../../../../assets/consts/consts';
import { InfoDialogComponent } from '../../../shared/dialogs/info-dialog/info-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public currentUser: User;
  public isEditMode = false;
  public isEditPasswordMode = false;

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private appStateService: AppStateService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private dialogFactoryService: DialogFactoryService
  ) {
  }

  public ngOnInit(): void {
    this.appStateService.user
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.initForm();
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.initForm();
  }

  public closePasswordChanges(): void {
    this.isEditPasswordMode = false;
  }

  public onChangePassword(): void {
    this.isEditPasswordMode = true;
  }

  public get languageEnum(): typeof LanguagesEnum {
    return LanguagesEnum;
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const payload = merge(this.currentUser, this.form.value);
    this.userService.updateUser(payload)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
          this.toggleEditMode();
          this.appStateService.getUser();
          setTimeout(() => {
            this.toastService.showMessage(
              'success',
              this.translateService.instant('t-toast.Success'),
              this.translateService.instant('my-profile.user-update-mess'),
            );
          }, DEBOUNCE_TIME_FOR_INPUT);
        },
        (err) => {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            err.error.title
          );
        });
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public onDeleteAccount(): void {
    if (this.currentUser.securityLevel === RoleType.RootAdmin && this.currentUser.countRootAdmins < 2) {
      const ref = this.dialogService.open(InfoDialogComponent, {
        showHeader: false,
        height: '80%',
        data: {
          header: 'my-profile.delete',
          text: 'my-profile.delete-account-error',
          btn: 'KPI.cancel'
        }
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
      return;
    }
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService
        .open(ConfirmationDialogComponent, {
          showHeader: false,
          data: {
            text: 'my-profile.delete-account-text',
            btn: 'my-profile.delete-btn',
          }
        });
      ref.onClose
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          if (res) {
            this.userService.deleteUser(this.currentUser.id)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                () => {
                  this.localStorageService.remove();
                  this.authService.stopRefreshTokenTimer();
                  this.toastService.showMessage(
                    'success',
                    this.translateService.instant('my-profile.delete-account-success'),
                    this.translateService.instant('my-profile.delete-account-success-deleted'),
                  );
                  this.router.navigate(['auth/login']);
                },
                (err) => {
                  this.toastService.showMessage(
                    'warn',
                    this.translateService.instant('t-toast.Failed'),
                    err
                  );
                }
              );
          }
        });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: [this.currentUser?.firstName || '',
        [Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(TEST_NAME_MAX_LENGTH)]],
      lastName: [this.currentUser?.lastName || '', [
        Validators.required,
        Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
        Validators.maxLength(TEST_NAME_MAX_LENGTH),
      ]],
      preferredLanguage: [
        this.currentUser?.preferredLanguage || 'EN',
        Validators.required,
      ],
    });
  }
}
