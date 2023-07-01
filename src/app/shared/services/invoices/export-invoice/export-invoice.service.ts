import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BTTest } from 'src/app/shared/models/bt-test.model';
import { PAID_TEST } from '../../../../../assets/consts/errors.const';
import { PaymentTypeBE } from '../../../enums/payment.type';
import { TestType } from '../../../enums/product.id.type';
import { Company } from '../../../models/company.model';
import { Invoice } from '../../../models/invoice.model';
import {
  CardPaymentPayload,
  InvoicePayment
} from '../../../models/payment.model';
import { Test } from '../../../models/test.model';
import { AppStateService } from '../../app-state/app-state.service';
import { LoadingService } from '../../app-state/loader.service';
import { OrderStateService } from '../../order/order-state.service';
import { PaymentStatusService } from '../../payment-status/payment-status.service';
import { PaymentService } from '../../payment/payment.service';
import { ToastService } from '../../toast/toast.service';
import { InvoicesStateService } from '../invoices-state.service';

@Injectable({
  providedIn: 'root',
})
export class ExportInvoiceService {
  public exportRequest: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public triggerPaymentSelections: BehaviorSubject<null> =
    new BehaviorSubject<null>(null);
  private _exportInvoice: Invoice;
  private _paymentType: PaymentTypeBE;
  private _payload: CardPaymentPayload | InvoicePayment;
  private _testType: TestType;
  private _test: Test | BTTest;

  constructor(
    private appStateService: AppStateService,
    private invoiceSS: InvoicesStateService,
    private loadingService: LoadingService,
    private orderSS: OrderStateService,
    private paymentService: PaymentService,
    private router: Router,
    private paymentStatusService: PaymentStatusService,
    private toastService: ToastService
  ) { }

  public get company$(): BehaviorSubject<Company> {
    return this.appStateService.currentCompany;
  }

  public get country$(): BehaviorSubject<string> {
    return this.appStateService.currentCountry;
  }

  public get exportInvoice(): Invoice {
    return this._exportInvoice;
  }

  public get payload(): CardPaymentPayload | InvoicePayment {
    return this._payload;
  }

  public setInvoiceForExport(
    test: Test | BTTest,
    paymentType: PaymentTypeBE,
    payload: CardPaymentPayload | InvoicePayment
  ): void {
    this.loadingService.changeLoadingState(true);
    this._test = test;
    this._paymentType = paymentType;
    this._payload = payload;
    this._testType = test.testType;
    this._exportInvoice = {
      transactionNumber: this.orderSS.currentOrder.getValue(),
      nameProduct: test.testName,
      totalAmount: Math.ceil(test.priceOfTest / test.currencyRate),
      created: Date.now().toString(),
      testType: test.testType,
      paymentType,
      currency: test.testCurrency,
      respondentCount:
        test.respondentRequirements?.countries[0]?.respondentCount,
    };
    this.exportRequest.next(true);
  }

  public setInvoicePDFImage(image: string): void {
    this.exportRequest.next(false);
    this._payload.receiptData = image;
    this._pay();
  }

  private _pay(): void {
    if (this._paymentType === PaymentTypeBE.Card) {
      sessionStorage.setItem('cardPayment', 'true');
      this.paymentService
        .createPayment(this._payload as CardPaymentPayload)
        .subscribe(
          (res) => {
            if (res.url) {
              this._test.isDraft = false;
              history.pushState(
                { cardPayment: true },
                '',
                window.location.origin + '/personal-area/test-library'
              );
              window.location.href = res.url;
              this.loadingService.changeLoadingState(false);
              this._exportInvoice = null;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.paymentService
        .createPaymentByInvoice(this._payload as InvoicePayment, this._testType)
        .subscribe(
          () => {
            this._successPayment();
          },
          (err) => {
            if (err.status === PAID_TEST) {
              this._successPayment();
            } else {
              this.appStateService.getCompany();
              this.toastService.showMessage('error', err.error.title, '');
              this.triggerPaymentSelections.next(null);
            }
          }
        );
    }
  }

  private _successPayment(): void {
    this.loadingService.changeLoadingState(false);
    this.router.navigate(['/personal-area/dashboard']);
    this.paymentStatusService.changeState(true);
    this._exportInvoice = null;
  }
}
