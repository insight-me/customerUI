import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../../models/company.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private httpClient: HttpClient) {}

  public getCompanyInfo(): Observable<Company> {
    return this.httpClient.get<Company>(`api/Company/GetCurrent`);
  }

  public getCompanyById(id: string): Observable<Company> {
    return this.httpClient.get<Company>(`api/Company/${id}`);
  }

  public updateCompanyById(id: string, body: Company): Observable<Company> {
    return this.httpClient.put<Company>(`api/Company/${id}`, body);
  }

  public deleteCompany(id: string, params: {code: string}): Observable<Company> {
    return this.httpClient.delete<Company>(`api/Company/${id}`, {params});
  }

  public getCompanyUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`api/User/GetAll`);
  }

  public inviteNewUser(body: any): Observable<any> {
    return this.httpClient.post('api/Account/Invite', body);
  }

  public changePermissionInUser(body: any): Observable<any> {
    return this.httpClient.put('api/Account/ChangePermission', body);
  }

  public resendInvitation(params: {id: string}): Observable<any> {
    return this.httpClient.get('api/Account/ResendInvitation', {params});
  }

  public lockUser(params: {email: string}): Observable<any> {
    return this.httpClient.get('api/Account/LockUser', {params});
  }

  public unlockUser(params: {email: string}): Observable<any> {
    return this.httpClient.get('api/Account/UnLockUser', {params});
  }

  public updateCompanyImage(body: any): Observable<any> {
    return this.httpClient.post<any>(`api/CompanyLogotype`, body);
  }

  public deleteCompanyImage(params: {companyId: string}): Observable<any> {
    return this.httpClient.delete<any>(`api/CompanyLogotype`, {params});
  }

  public deleteCompanyInitial(): Observable<any> {
    return this.httpClient.get<any>(`api/Company/DeleteCompanyInitial`);
  }
}
