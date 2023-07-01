import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(private httpClient: HttpClient) {}

  public getTags(body: any): Observable<any> {
    return this.httpClient.post<any>(`api/Tag/GetTags`, body);
  }

  public getTriggers(body: any): Observable<any> {
    return this.httpClient.post<any>(`api/Tag/GetTriggers`, body);
  }
}
