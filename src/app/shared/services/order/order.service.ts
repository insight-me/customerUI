import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderLibraryItem, OrderResponse } from '../../models/order.model';
import { FilterModel } from '../../models/library.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  public getOrders(reqBody: FilterModel): Observable<any> {
    return this.httpClient.post<any>(`api/Order/GetAll`, reqBody);
  }

  public getTotalPages(reqBody: FilterModel): Observable<any> {
    return this.httpClient.post<any>(`api/Order/CountByFilter`, reqBody);
  }

  public createOrder(body: Order): Observable<OrderResponse> {
    return this.httpClient.post<OrderResponse>(`api/Order`, body);
  }

  public getOrderById(id: string): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(`api/Order/${id}`);
  }
}
