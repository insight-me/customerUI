import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { TestType } from '../../enums/product.id.type';
import { CardPaymentPayload, InvoicePayment } from '../../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private httpClient: HttpClient) { }

  public createPayment(body: CardPaymentPayload): Observable<any> {
    return this.httpClient.post<any>(`api/Payment`, body);
  }

  public createPaymentByInvoice(body: InvoicePayment, type: TestType, testId?: string): Observable<any> {
    return defer(() => type === TestType.BIC ? this.createBICPayment(body) : this.createBTPayment(testId));
  }

  public createBICPayment(body: InvoicePayment): Observable<any> {
    return this.httpClient.post<any>(`api/Payment/BICPayment`, body);
  }

  public createBTPayment(testId: string): Observable<any> {
    return this.httpClient.get<any>(`api/Payment/SendToApprove`, {
      params: {
        testId
      }
    });
  }

  public verifyPayment(testId: string): Observable<any> {
    return this.httpClient.get<any>(`api/Payment/VerifyPanel?testId=${testId}`);
  }
}
