import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { BTTest, CategoryInvolvement, SubCategoryInvolvement } from '../../models/bt-test.model';
import { Association, CalcTestData, CreateTest } from '../../models/test.model';

@Injectable({
  providedIn: 'root'
})
export class BtTestService {

  constructor(private httpClient: HttpClient) {
  }

  public createTest(body: CreateTest): Observable<any> { // TODO CHANGE ANY
    return this.httpClient.post<any>(`api/BTTest`, body);
  }

  public updateTest(body: BTTest): Observable<BTTest> {
    return this.httpClient.put<BTTest>(`api/BTTest`, body);
  }

  public getAssociations(lang?: string): Observable<Association[]> {
    const params = new HttpParams().set(
      'language',
      lang ?? JSON.parse(localStorage.getItem('language')).toUpperCase()
    );
    return this.httpClient.get<Association[]>(`api/BTTest/GetAssociations`, {
      params,
    });
  }

  public getInvolvementCategory(lang?: string): Observable<CategoryInvolvement[]> {
    const params = new HttpParams().set(
      'language',
      lang ?? JSON.parse(localStorage.getItem('language')).toUpperCase()
    );
    return this.httpClient.get<CategoryInvolvement[]>(`api/BTTest/GetInvolvementCategories`, {
      params,
    });
  }

  public getInvolvement(categoryId: string, lang?: string): Observable<SubCategoryInvolvement[]> {
    const params = new HttpParams().set(
      'language',
      lang ?? JSON.parse(localStorage.getItem('language')).toUpperCase()
    ).set('categoryId', categoryId);
    return this.httpClient.get<SubCategoryInvolvement[]>(`api/BTTest/GetInvolvements`, {
      params,
    });
  }

  public getTestById(testId: string): Observable<BTTest> {
    return this.httpClient.get<any>(`api/BTTest/${testId}`);
  }

  public getTestKPIs(): Observable<any> {
    const params = new HttpParams().set(
      'language',
      JSON.parse(localStorage.getItem('language')).toUpperCase()
    );
    return this.httpClient.get<any>(`api/BTTest/GetKPIs`, {
      params,
    }).pipe(share());
  }

  public getTestPriceAndTime(): Observable<any> {
    return this.httpClient.get<any>(`api/BTTest/GetTestPriceAndTime`);
  }

  public calcTestBT(data: CalcTestData): Observable<any> {
    return this.httpClient.post<any>(`api/BTTest/CalcTest`, data);
  }

  public copyTest(testId: string, testName: string): Observable<string> {
    const params = new HttpParams()
      .set('testId', testId)
      .set('testName', testName);
    return this.httpClient.get<string>(`api/BTTest/CopyTest`, { params });
  }
}
