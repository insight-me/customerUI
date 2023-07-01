import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentStatusService } from '../../services/payment-status/payment-status.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {
  public isSuccessPayment$: Observable<boolean>;
  public cardPayment$: Observable<boolean>;

  get isBtTest(): boolean {
    return this.paymentStatusService.isBtTest;
  }

  constructor(private paymentStatusService: PaymentStatusService, private router: Router) { }

  public ngOnInit(): void {
    this.isSuccessPayment$ = this.paymentStatusService.getValue();
    this.cardPayment$ = this.paymentStatusService.getCardPayment();
  }

  public close(): void {
    this.router.navigate(['personal-area/dashboard']);
    this.paymentStatusService.changeState(false);
  }

  public getText(cardPayment: boolean): string {
    return cardPayment ? 'payment.Thank you for creating a test!' : (this.isBtTest ? 'payment.bt_success' : 'confirm-test.payment-success');
  }
}
