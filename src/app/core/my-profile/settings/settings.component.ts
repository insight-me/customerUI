import { Component, OnDestroy, OnInit } from '@angular/core';
import { InviteNewUserDialogComponent } from '../../../shared/dialogs/invite-new-user-dialog/invite-new-user-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AppStateService } from '../../../shared/services/app-state/app-state.service';
import { RoleType, User } from '../../../shared/models/user.model';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { UserService } from '../../../shared/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ChangePermissionDialogComponent } from '../../../shared/dialogs/change-permission-dialog/change-permission-dialog.component';
import { MAX_ROOT_ADMINS, ROLES } from '../../../../assets/consts/consts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InfoDialogComponent } from '../../../shared/dialogs/info-dialog/info-dialog.component';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  public currentUser: User;
  public users = [];
  public showPopup = [];
  public rightOptions = ROLES;
  public isUserOrder = 0;
  public isStatusOrder = 0;
  public isRightOrder = 0;

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private dialogService: DialogService,
              private appStateService: AppStateService,
              private companyService: CompanyService,
              private translateService: TranslateService,
              private toastService: ToastService,
              private userService: UserService) {
  }

  public ngOnInit(): void {
    this.appStateService.user
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.currentUser = user;
      });
    this.getUsers();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getFullName(user: User): string {
    return `${user?.firstName} ${user?.lastName}`;
  }

  public inviteNewUser(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(InviteNewUserDialogComponent, {
        showHeader: false,
        data: { currentUser: this.currentUser },
      });
      ref.onClose
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
            if (res) {
              this.getUsers();
              this.toastService.showMessage(
                'success',
                this.translateService.instant('my-profile.successfully-submitted'),
                this.translateService.instant('my-profile.invite-new-user-success'),
              );
            }
          },
          (err) => {
            this.toastService.showMessage(
              'warn',
              this.translateService.instant('t-toast.Failed'),
              err.error.title
            );
          });
    }
  }

  public getUserRole(user: User): string {
    return RoleType[user.securityLevel];
  }

  public get isNotManager(): boolean {
    return this.currentUser?.securityLevel !== RoleType.Manager;
  }

  public get isAdmin(): boolean {
    return this.currentUser?.securityLevel === RoleType.Admin;
  }

  public openPopup(index: number): void {
    if (!this.showPopup[index]) {
      this.showPopup = [];
    }
    this.showPopup[index] = !this.showPopup[index];
  }

  public onReVerification(id: string): void {
    this.companyService.resendInvitation({ id })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
          this.toastService.showMessage(
            'success',
            this.translateService.instant('my-profile.successfully-submitted'),
            this.translateService.instant('my-profile.new-link-sent'),
          );
        },
        (err) => {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            err.error.title
          );
        });
  }

  public onDeleteUser(user: User): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        showHeader: false,
        data: {
          header: 'my-profile.delete-user',
          text: this.translateService.instant('my-profile.sure-delete-user', {
            name: this.getFullName(user)
          }),
        },
      });
      ref.onClose
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          if (res) {
            this.userService.deleteUser(user.id)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                  this.users = this.users.filter((person) => person.id !== user.id);
                  this.toastService.showMessage(
                    'success',
                    this.translateService.instant('my-profile.delete-account-success'),
                    this.translateService.instant('my-profile.delete-account-success-deleted'),
                  );
                },
                (err) => {
                  this.toastService.showMessage(
                    'warn',
                    this.translateService.instant('t-toast.Failed'),
                    err.error.title
                  );
                });
          }
        });
    }
  }

  public onLockUser(email: string, user: User): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        showHeader: false,
        data: {
          header: 'my-profile.block-user-header',
          text: this.translateService.instant('my-profile.sure-to-block', {
            user: this.getFullName(user)
          }),
          btn: 'my-profile.block'
        },
      });
      ref.onClose
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          if (res) {
            this.companyService.lockUser({ email })
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                  this.users[this.users.findIndex((person) => person.id === user.id)].isLocked = true;
                  this.toastService.showMessage(
                    'success',
                    this.translateService.instant('my-profile.successfully-submitted'),
                    this.translateService.instant('my-profile.block-user'),
                  );
                },
                (err) => {
                  this.toastService.showMessage(
                    'warn',
                    this.translateService.instant('t-toast.Failed'),
                    err.error.title
                  );
                });
          }
        });
    }
  }

  public onUnLockUser(user: User): void {
    if (this.currentUser.countRootAdmins === 2 && user.securityLevel === RoleType.RootAdmin) {
      const ref = this.dialogService.open(InfoDialogComponent, {
        height: '100%',
        showHeader: false,
        data: {
          text: 'my-profile.warning',
          btn: 'my-profile.go-back-to-settings'
        }
      });
      return;
    }
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        showHeader: false,
        data: {
          header: 'my-profile.unblock-user-header',
          text: this.translateService.instant('my-profile.sure-to-unblock', {
            user: this.getFullName(user)
          }),
          btn: 'my-profile.unblock'
        },
      });
      ref.onClose
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          if (res) {
            this.companyService.unlockUser({ email: user.email })
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                  this.users[this.users.findIndex((person) => person.id === user.id)].isLocked = false;
                  this.toastService.showMessage(
                    'success',
                    this.translateService.instant('my-profile.successfully-submitted'),
                    this.translateService.instant('my-profile.unblock-user'),
                  );
                },
                (err) => {
                  this.toastService.showMessage(
                    'warn',
                    this.translateService.instant('t-toast.Failed'),
                    err.error.title
                  );
                });
          }
        });
    }
  }

  public onEditUser(user: User): void {
    let rightOptions = this.rightOptions
      .filter((right) => right.value !== user.securityLevel);
    if (user.isLocked) {
      rightOptions = rightOptions.filter((right) => right.value !== 0);
    }
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ChangePermissionDialogComponent, {
        showHeader: false,
        data: {
          rightOptions,
        },
      });
      ref.onClose
        .subscribe((res) => {
          if (res) {
            if (res.value === 0 && this.currentUser.countRootAdmins === MAX_ROOT_ADMINS) {
              this.toastService.showMessage(
                'warn',
                this.translateService.instant('t-toast.Failed'),
                this.translateService.instant('my-profile.max-2-admins'),
              );
              return;
            }
            this.companyService.changePermissionInUser({ id: user.id, role: res.value })
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                  this.toastService.showMessage(
                    'success',
                    this.translateService.instant('my-profile.successfully-submitted'),
                    this.translateService.instant('my-profile.change-rights-success'),
                  );
                  this.getUsers();
                },
                (err) => {
                  this.toastService.showMessage(
                    'warn',
                    this.translateService.instant('t-toast.Failed'),
                    err.error.title
                  );
                });
          }
        });
    }
  }

  public sortByUser(): void {
    switch (this.isUserOrder) {
      case(0):
        this.users = orderBy(this.users, ['firstName', 'lastName'], ['asc', 'asc']);
        this.isUserOrder = 1;
        this.isStatusOrder = 0;
        this.isRightOrder = 0;
        break;
      case(1):
        this.users = orderBy(this.users, ['firstName', 'lastName'], ['desc', 'asc']);
        this.isUserOrder = 2;
        break;
      case(2):
        this.sortByInitial();
    }
  }

  public sortByStatus(): void {
    switch (this.isStatusOrder) {
      case(0):
        this.users = orderBy(this.users, ['isRegistrationConfirmed', 'isLocked'], ['desc', 'desc']);
        this.isStatusOrder = 1;
        this.isUserOrder = 0;
        this.isRightOrder = 0;
        break;
      case(1):
        this.users = orderBy(this.users, ['isLocked', 'isRegistrationConfirmed'], ['asc', 'asc']);
        this.isStatusOrder = 2;
        break;
      case(2):
        this.sortByInitial();
    }
  }

  public sortByRight(): void {
    switch (this.isRightOrder) {
      case(0):
        this.users = orderBy(this.users, ['securityLevel', 'firstName'], ['asc', 'asc']);
        this.isRightOrder = 1;
        this.isUserOrder = 0;
        this.isStatusOrder = 0;
        break;
      case(1):
        this.users = orderBy(this.users, ['securityLevel', 'firstName'], ['desc', 'asc']);
        this.isRightOrder = 2;
        break;
      case(2):
        this.sortByInitial();
    }
  }

  private sortByInitial(): void {
    this.users = orderBy(this.users, ['firstName', 'lastName'], ['asc', 'asc']);
    this.isStatusOrder = 0;
    this.isUserOrder = 0;
    this.isRightOrder = 0;
  }

  private getUsers(): void {
    this.companyService.getCompanyUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.users = res.filter((item) => item.id !== this.currentUser?.id);
        this.users = orderBy(this.users, ['firstName', 'lastName'], ['asc', 'asc']);
      });
  }
}
