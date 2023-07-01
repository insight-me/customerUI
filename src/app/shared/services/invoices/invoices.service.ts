import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private httpClient: HttpClient) {
  }

  public getInvoices(): Observable<Invoice[]> {
    return this.httpClient.get<Invoice[]>(`api/Invoice`);
  }

  public getReceiptByUrl(url: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get<any>(`api/Invoice/ReceiptbyUrl?url=${url}`, {
      headers,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    });
  }

  // public createInvoice(body: Invoice): Observable<Invoice> {
  //   return this.httpClient.post<Invoice>(`api/Invoice`, body);
  // }

  public editInvoice(body: Invoice): Observable<Invoice> {
    return this.httpClient.put<Invoice>(`api/Invoice`, body);
  }

  // public getInvoiceById(id: string): Observable<Invoice> {
  //   return this.httpClient.get<Invoice>(`api/Invoice/${id}`);
  // }
  //
  // public deleteInvoiceById(id: string): Observable<Invoice> {
  //   return this.httpClient.delete<Invoice>(`api/Invoice/${id}`);
  // }
}
