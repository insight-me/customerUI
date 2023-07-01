import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { BTTest } from 'src/app/shared/models/bt-test.model';
import {
  CardPaymentPayload,
  PaymentTypeInArray,
  PaymentTypes
} from 'src/app/shared/models/payment.model';
import { Test } from 'src/app/shared/models/test.model';
import { PAYMENT_TYPES } from '../../../../../../assets/consts/payment.consts';
import {
  PaymentType,
  PaymentTypeBE
} from '../../../../../shared/enums/payment.type';
import { Company } from '../../../../../shared/models/company.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { ExportInvoiceService } from '../../../../../shared/services/invoices/export-invoice/export-invoice.service';

@Component({
  selector: 'app-payment-selection',
  templateUrl: './payment-selection.component.html',
  styleUrls: ['./payment-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSelectionComponent implements OnInit, OnDestroy {
  @Input() test: Test | BTTest;
  @Input() cost: string;
  @Input() currencyCost: string;
  @Input() set testType(testType: TestType) {
    if (testType === TestType.BT) {
      this.paymentChoice = [PAYMENT_TYPES[0]];
    }
  }

  public testTypeEnum = TestType;

  @Output() closeSection: EventEmitter<void> = new EventEmitter();

  public paymentChoice: PaymentTypes[] = PAYMENT_TYPES;
  public paymentControl: FormControl = new FormControl(PAYMENT_TYPES[0]);
  public isInvoicePayment = false;
  public showCardPayment = false;
  public showContent = false;
  private _company: Company;
  private _sub: Subscription = new Subscription();

  @HostListener('window:pageshow', ['$event'])
  goToLibraryFromStripe(event: PageTransitionEvent): void {
    if (event.persisted) {
      window.location.reload();
    }
  }

  get isBt(): boolean {
    return this.test.testType === TestType.BT;
  }

  constructor(
    public exportInvoiceS: ExportInvoiceService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  public ngOnInit(): void {
    if (sessionStorage.getItem('cardPayment')) {
      this.router.navigate(['personal-area/test-library']);
    }
    this.appStateService.getCompany();
    this._sub = this.appStateService.company.subscribe({
      next: (company) => {
        this._company = company;
        this._setInitialValue();
      },
    });
    this._getTriggerSelectionPaymentSubscription();
  }

  public ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  public get PaymentType(): typeof PaymentType {
    return PaymentType;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public getIsDisabledPayment(choice: PaymentTypes): boolean {
    switch (choice.label) {
      case PaymentType.Invoice:
        return !this._company.isApprovedVATNumber;
      case PaymentType.Card:
        return false;
    }
  }

  public isActiveInput(choice: PaymentTypes): boolean {
    return this.paymentControl.value?.label === choice.label;
  }

  public onSelectPayment(): void {
    switch (this.paymentControl.value?.label) {
      case PaymentType.Card:
        this._createCardPayment();
        break;
      case PaymentType.Invoice:
        this.isInvoicePayment = true;
        break;
    }
  }

  private _setInitialValue(): void {
    this.paymentControl.setValue(
      this.paymentChoice[
      this.getIsDisabledPayment(
        this.paymentChoice[PaymentTypeInArray.Invoice]
      )
        ? this.test.testType === TestType.BIC
          ? PaymentTypeInArray.Card
          : null
        : PaymentTypeInArray.Invoice
      ]
    );
    this.showContent = true;
    this.cdr.detectChanges();
  }

  private _createCardPayment(): void {
    this.showCardPayment = true;
    const payload: CardPaymentPayload = {
      priceInCent: this.test.priceOfTest,
      currency: 'SEK',
      orderId: this.test.orderId,
      orderDescription: '',
      companyName: this._company.companyName,
      orgNumber: this._company.orgNumber,
      address: this._company.street,
      zip: this._company.postalCode,
      city: this._company.city,
      country: this._company.countryCode,
      companyContactName: this._company.contactName,
      companyContactSurname: this._company.contactSurname,
      companyContactMail: this._company.contactMail,
      receiptData: '',
    };
    this.exportInvoiceS.setInvoiceForExport(
      this.test,
      PaymentTypeBE.Card,
      payload
    );
  }

  private _getTriggerSelectionPaymentSubscription(): void {
    this._sub.add(
      this.exportInvoiceS.triggerPaymentSelections.subscribe({
        next: () => {
          this.isInvoicePayment = false;
          this.cdr.detectChanges();
        },
      })
    );
  }
}
