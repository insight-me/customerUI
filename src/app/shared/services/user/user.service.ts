import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Countries } from '../../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public getUserInfo(): Observable<User> {
    return this.httpClient.get<User>(`api/User/GetCurrent`);
  }

  public getCountriesList(): Observable<Countries[]> {
    return this.httpClient.get<Countries[]>(`api/Country`);
  }

  public getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`api/User/${id}`);
  }

  public updateUser(body: User): Observable<User> {
    return this.httpClient.put<User>(`api/User`, body);
  }

  public deleteUser(id: string): Observable<User> {
    return this.httpClient.delete<User>(`api/User/${id}`);
  }

  public changePassword(body: any): Observable<any> {
    return this.httpClient.post<any>(`api/Account/ChangePassword`, body);
  }
}
