import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteCompanyRequestDialogComponent } from 'src/app/shared/dialogs/delete-company-request/delete-company-request.component';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { Company } from 'src/app/shared/models/company.model';
import { RoleType, User } from 'src/app/shared/models/user.model';
import { merge, omit } from 'lodash';
import { LocalStorageService } from 'src/app/shared/services/app-state/local-storage.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { DialogFactoryService } from 'src/app/shared/services/dialog/dialog-factory.service';
import {
  INPUT_MAX_COMPANY_ADDRESS,
  INPUT_MAX_LENGTH_NAME,
  INPUT_MAX_POSTAL_CODE,
  INPUT_MIN_LENGTH__PASSWORD,
  TEST_NAME_MAX_LENGTH,
} from '../../../../assets/consts/consts';
import { ChangeCompanyAddressComponent } from '../change-company-address/change-company-address.component';

@Component({
  templateUrl: './company-information.component.html',
  styleUrls: [
    './company-information.component.scss',
    '../personal-information/personal-information.component.scss',
  ],
})
export class CompanyInformationComponent implements OnInit, OnDestroy {
  public isEditMode = false;
  public form: FormGroup;
  public currentUser: User;
  public currentCompany: Company;
  public currentCountry = null;
  public address: any = {};
  public fileType: string;
  public imageDeleted = false;

  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private companyService: CompanyService,
    private appStateService: AppStateService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService,
    private dialogFactoryService: DialogFactoryService
  ) {}

  public ngOnInit(): void {
    // this.appStateService.getCountries();
    this.appStateService.user
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.currentUser = user;
        if (this.currentUser) {
          this.initForm();
          this.appStateService.getCompany();
          this.getCompany();
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountry(): void {
    this.appStateService.countries
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((countries) => {
        const currentCountry = countries.find(
          (item) => item.countryCode === this.currentCompany?.countryCode
        );
        this.currentCountry = currentCountry?.countryName;
      });
  }

  public get isNotManager(): boolean {
    return this.currentUser?.securityLevel !== RoleType.Manager;
  }

  public get isRootAdmin(): boolean {
    return this.currentUser?.securityLevel === RoleType.RootAdmin;
  }

  public toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  public closeEditMode(): void {
    this.initForm();
    this.toggleEditMode();
  }

  public onSubmit(): void {
    if (
      this.form.controls.city.value !== this.currentCompany.city ||
      this.form.controls.postalCode.value !== this.currentCompany.postalCode ||
      this.form.controls.companyAddress.value !== this.currentCompany.street ||
      (this.form.controls.vatNumber.value !== this.currentCompany.vatNumber &&
        this.form.controls.vatNumber.value !== '' &&
        this.currentCompany.vatNumber !== null)
    ) {
      const ref = this.dialogService.open(ChangeCompanyAddressComponent, {
        showHeader: false,
      });
      ref.onClose.subscribe((res) => {
        if (res) {
          this._updateCompanyInfo();
        } else {
          this.closeEditMode();
        }
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    } else {
      this._updateCompanyInfo();
    }
  }

  public requestToDeleteCompany(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(DeleteCompanyRequestDialogComponent, {
        showHeader: false,
        data: { id: this.currentCompany.id },
      });
      ref.onClose.subscribe((res) => {
        if (res) {
          this.localStorageService.remove();
          this.authService.stopRefreshTokenTimer();
          this.appStateService.deleteCurrentUser();
          this.router.navigate(['auth/login']);
        }
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public onUpdateImage(data: { image: string; type: string }): void {
    this.imageDeleted = !data;
    this.fileType = data?.type;
    this.form.patchValue({
      logotypeUrl: data?.image,
    });
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  private getCompany(): void {
    this.appStateService.company
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((company) => {
        if (company) {
          this.currentCompany = company;
          this.getCountry();
          this.initForm();
        }
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      companyName: [
        {
          value: this.currentCompany?.companyName || '',
          disabled: !this.isNotManager,
        },
        [
          Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(INPUT_MAX_LENGTH_NAME),
        ],
      ],
      contactName: [
        {
          value: this.currentCompany?.contactName || '',
          disabled: !this.isNotManager,
        },
        [
          Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(TEST_NAME_MAX_LENGTH),
        ],
      ],
      contactSurname: [
        {
          value: this.currentCompany?.contactSurname || '',
          disabled: !this.isNotManager,
        },
        [
          Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(TEST_NAME_MAX_LENGTH),
        ],
      ],
      logotypeUrl: [
        {
          value: '',
          disabled: !this.isNotManager,
        },
      ],
      city: [
        {
          value: this.currentCompany?.city ? this.currentCompany.city : '',
          disabled: !this.isNotManager,
        },
        [
          Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(TEST_NAME_MAX_LENGTH),
        ],
      ],
      companyAddress: [
        {
          value: this.currentCompany?.street,
          disabled: !this.isNotManager,
        },
        [
          Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(INPUT_MAX_COMPANY_ADDRESS),
        ],
      ],
      postalCode: [
        {
          value: this.currentCompany?.postalCode
            ? this.currentCompany.postalCode
            : '',
          disabled: !this.isNotManager,
        },
        [
          Validators.required,
          Validators.minLength(INPUT_MIN_LENGTH__PASSWORD),
          Validators.maxLength(INPUT_MAX_POSTAL_CODE),
        ],
      ],
      orgNumber: [
        {
          value: this.currentCompany?.orgNumber || '',
          disabled: !this.isNotManager,
        },
        Validators.required,
      ],
      vatNumber: [
        {
          value: this.currentCompany?.vatNumber || '',
          disabled: !this.isNotManager,
        },
      ],
    });
  }

  private _updateCompanyInfo(): void {
    const form = merge(this.form.value, this.address);
    const payload = omit(merge({ ...this.currentCompany }, form), [
      'country',
      'companyAddress',
      'state',
      'logotypeUrl',
    ]);
    payload.street = this.form.controls.companyAddress.value.trim();
    if (this.form.controls.logotypeUrl.value) {
      this.currentCompany.logotypeUrl = this.form.controls.logotypeUrl.value;
    }
    if (this.imageDeleted) {
      this.currentCompany.logotypeUrl = this.form.controls.logotypeUrl.value;
    }
    this.companyService
      .updateCompanyById(this.currentCompany.id, payload)
      .pipe(
        switchMap(() => {
          if (form.logotypeUrl) {
            const imagePayload = {
              companyId: this.currentCompany.id,
              dataURlLogo: form.logotypeUrl,
              originalExtension: this.fileType.split('/')[1].split('+')[0],
            };
            return this.companyService.updateCompanyImage(imagePayload);
          } else if (this.imageDeleted) {
            return this.companyService.deleteCompanyImage({
              companyId: this.currentCompany.id,
            });
          }
          this.appStateService.getCompany();
          this.toggleEditMode();
          this.toastService.showMessage(
            'success',
            this.translateService.instant('t-toast.Success'),
            this.translateService.instant('my-profile.company-update-mess')
          );
          return of();
        })
      )
      .subscribe(
        () => {
          this.appStateService.getCompany();
          this.toggleEditMode();
          this.toastService.showMessage(
            'success',
            this.translateService.instant('t-toast.Success'),
            this.translateService.instant('my-profile.company-update-mess')
          );
        },
        (err) => {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            err.error?.title
          );
        }
      );
  }
}
