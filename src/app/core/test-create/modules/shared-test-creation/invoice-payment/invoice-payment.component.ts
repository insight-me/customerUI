import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TestType } from 'src/app/shared/enums/product.id.type';
import {
  INPUT_MAX_COMPANY_ADDRESS,
  INPUT_MAX_LENGTH_NAME,
  INPUT_MAX_POSTAL_CODE,
  INPUT_MIN_LENGTH__PASSWORD,
  NO_ORDER_ID,
  TEST_NAME_MAX_LENGTH
} from '../../../../../../assets/consts/consts';
import { BTTest } from '../../../../../shared/models/bt-test.model';
import { InvoiceTable } from '../../../../../shared/models/invoice.model';
import { Test } from '../../../../../shared/models/test.model';
import { RoleType, User } from '../../../../../shared/models/user.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { ExportInvoiceService } from '../../../../../shared/services/invoices/export-invoice/export-invoice.service';
import { PaymentStatusService } from '../../../../../shared/services/payment-status/payment-status.service';
import { PaymentService } from '../../../../../shared/services/payment/payment.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss'],
})
export class InvoicePaymentComponent implements OnDestroy {
  @Input() set test(value: Test | BTTest) {
    this._test = value;
    if (value) {
      this._setTestCost();
    }
    if (value.orderId !== NO_ORDER_ID) {
      this._getCompany();
      this._getUser();
    }
  }


  get test(): Test | BTTest {
    return this._test;
  }

  public testType = TestType;
  public company = null;
  public currentCountry = null;
  public form: FormGroup = new FormGroup({});
  public isEditMode = false;
  public currentUser: User;
  public testCost = '0';
  public testCostInCurrency = '0';
  private _test: Test | BTTest = null;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appStateService: AppStateService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private paymentService: PaymentService,
    private router: Router,
    private paymentStatusService: PaymentStatusService,
    private translateService: TranslateService,
    public exportInvoiceService: ExportInvoiceService
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountry(): void {
    this.appStateService.countries.pipe(takeUntil(this.ngUnsubscribe)).subscribe(countries => {
      const currentCountry = countries.find(item => item.countryCode === this.company.countryCode);
      this.currentCountry = currentCountry?.countryName;
    });
  }

  public setEditMode(): void {
    this._initForm();
    this.isEditMode = !this.isEditMode;
  }

  public get isNotManager(): boolean {
    return this.currentUser?.securityLevel !== RoleType.Manager;
  }

  public hasErrors(control: string): boolean {
    if (this.form.contains(control)) {
      const currentControl = this.form.controls[control] as FormControl;
      return currentControl.touched && currentControl.invalid;
    }
    return false;
  }

  public setErrorMessage(control: string): string {
    const currentControl = this.form.controls[control] as FormControl;
    if (currentControl.touched && currentControl.invalid) {
      if (currentControl.errors.required) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant('confirm-test.is-requared')}.`;
      }
      if (currentControl.errors.email) {
        return this.translateService.instant('t-login-errors.Please, check your e-mail.');
      }
      if (currentControl.errors.minlength) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant('confirm-test.must-be-at-least')} ${currentControl.errors.minlength.requiredLength
          } ${this.translateService.instant('confirm-test.symbols')}`;
      }
      if (currentControl.errors.maxlength) {
        return `${this.translateService.instant(InvoiceTable[control])} ${this.translateService.instant(
          'confirm-test.length-must-be-maximum'
        )} ${currentControl.errors.maxlength.requiredLength} ${this.translateService.instant('confirm-test.symbols')}`;
      }
    }
  }

  public checkForm(): void {
    if (this.form.invalid) {
      this.toastService.showMessage(
        'error',
        this.isEditMode
          ? this.translateService.instant('confirm-test.error-form')
          : this.translateService.instant('payment.Please fill in VAT number in the organization profile'),
        ''
      );
    } else {
      this._createInvoice();
    }
  }

  private _createInvoice(): void {
    this._btConfirm();
    return;


    // const payment: InvoicePayment = this.form.getRawValue();
    // payment.orderDescription = '';
    // payment.currency = 'SEK';
    // payment.country = this.company.countryCode;
    // this.exportInvoiceService.setInvoiceForExport(this.test, PaymentTypeBE.Invoice, payment);
  }

  private _btConfirm(): void {
    this.paymentService.createBTPayment(this.test.id)
      .pipe(tap({
        next: () => {
          this.router.navigate(['personal-area/dashboard']);
          this.paymentStatusService.isBtTest = true;
          this.paymentStatusService.changeState(true);
        }
      }))
      .subscribe();
  }

  private _getCompany(): void {
    this.appStateService.getCompany();
    this.appStateService.company.pipe(takeUntil(this.ngUnsubscribe)).subscribe(company => {
      if (company) {
        this.company = company;
        this.getCountry();
        this._initForm();
      }
    });
  }

  private _getUser(): void {
    this.appStateService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.currentUser = user;
    });
  }

  private _setTestCost(): void {
    this.testCost = TestCreationUtils.getCost(this.test.priceOfTest);
    this.testCostInCurrency = TestCreationUtils.getCostInCurrency(this.test);
  }

  private _initForm(): void {
    this.form = this.fb.group({
      priceInCent: this.test.priceOfTest,
      currency: this.test.testCurrency,
      orderId: this.test.orderId,
      companyName: [
        this.company.companyName,
        [Validators.required, Validators.minLength(INPUT_MIN_LENGTH__PASSWORD), Validators.maxLength(INPUT_MAX_LENGTH_NAME)],
      ],
      orgNumber: this.company.orgNumber,
      address: [
        this.company.street,
        [Validators.required, Validators.minLength(INPUT_MIN_LENGTH__PASSWORD), Validators.maxLength(INPUT_MAX_COMPANY_ADDRESS)],
      ],
      zip: [
        this.company.postalCode,
        [Validators.required, Validators.minLength(INPUT_MIN_LENGTH__PASSWORD), Validators.maxLength(INPUT_MAX_POSTAL_CODE)],
      ],
      city: [
        this.company.city,
        [Validators.required, Validators.minLength(INPUT_MIN_LENGTH__PASSWORD), Validators.maxLength(TEST_NAME_MAX_LENGTH)],
      ],
      country: this.currentCountry,
      companyContactName: [
        this.company.contactName,
        [Validators.required, Validators.minLength(INPUT_MIN_LENGTH__PASSWORD), Validators.maxLength(TEST_NAME_MAX_LENGTH)],
      ],
      companyContactSurname: [
        this.company.contactSurname,
        [Validators.required, Validators.minLength(INPUT_MIN_LENGTH__PASSWORD), Validators.maxLength(TEST_NAME_MAX_LENGTH)],
      ],
      companyContactMail: [this.company.contactMail, [Validators.required, Validators.email]],
      vatNumber: [this.company.vatNumber, [Validators.required]],
    });
  }
}
