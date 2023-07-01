import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentStatusService {
  private _paymentSuccessfullState: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _paymentFailState: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public _cardPayment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public isBtTest!: boolean;

  public getValue(): Observable<boolean> {
    return this._paymentSuccessfullState.asObservable();
  }

  public changeState(isSuccess: boolean): void {
    this._paymentSuccessfullState.next(isSuccess);
  }

  public getFailStatus(): Observable<boolean> {
    return this._paymentFailState.asObservable();
  }

  public changeFailState(isFail: boolean): void {
    this._paymentFailState.next(isFail);
  }

  public changeCardPayment(cardPayment: boolean): void {
    this._cardPayment.next(cardPayment);
  }

  public getCardPayment(): Observable<boolean> {
    return this._cardPayment.asObservable();
  }
}
