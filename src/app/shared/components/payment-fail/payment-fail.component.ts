import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentStatusService } from '../../services/payment-status/payment-status.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.component.html',
  styleUrls: [
    './payment-fail.component.scss',
    '../payment-success/payment-success.component.scss',
  ],
})
export class PaymentFailComponent implements OnInit {
  public isFailPayment$: Observable<boolean>;

  constructor(
    private paymentStatusService: PaymentStatusService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.isFailPayment$ = this.paymentStatusService.getFailStatus();
  }

  public get failedImage(): string {
    return (
      '../../../../assets/images/svg/payment/ic_payment-fail-' +
      JSON.parse(localStorage.getItem('language')).toLowerCase() +
      '.svg'
    );
  }

  public close(): void {
    this.router.navigate(['personal-area/test-library']);
    this.paymentStatusService.changeFailState(false);
  }
}
