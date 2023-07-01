import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {
  public currentOrder: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _currentOrder: number;

  constructor() {
  }

  public setOrder(orderId: number): void {
    this._currentOrder = orderId;
    this.currentOrder.next(this._currentOrder);
  }
}
