import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalcTimeModel } from '../../models/bic.test/calc.time.model';
import { Association, CalcTestData, CreateTest, Statement, Test } from '../../models/test.model';

@Injectable({
  providedIn: 'root'
})
export class BicTestService {
  constructor(private httpClient: HttpClient) {
  }

  public createTest(body: CreateTest): Observable<Test> {
    return this.httpClient.post<Test>(`api/BICTest`, body);
  }

  public getTestById(testId: string): Observable<Test> {
    return this.httpClient.get<any>(`api/BICTest/${testId}`);
  }

  public updateTest(body: Test): Observable<Test> {
    return this.httpClient.put<Test>(`api/BICTest`, body);
  }

  public saveMoodBoard(body: any, testId: string): Observable<any> {
    return this.httpClient.post<any>(`api/BICTest/${testId}/MoodBoard`, body);
  }

  public updateMoodBoard(body: any): Observable<void> {
    return this.httpClient.put<void>(`api/BICTest/MoodBoard`, body);
  }

  public createConcept(body: any): Observable<any> {
    return this.httpClient.post<any>(`api/BICTest/CreateTestConcept`, body);
  }

  public getStatements(lang?: string): Observable<Statement[]> {
    const params = new HttpParams().set(
      'language',
      lang ?? JSON.parse(localStorage.getItem('language')).toUpperCase(),
    );
    return this.httpClient.get<Statement[]>(`api/BICTest/GetKPIs`, {
      params,
    });
  }

  public getAssociations(lang?: string): Observable<Association[]> {
    const params = new HttpParams().set(
      'language',
      lang ?? JSON.parse(localStorage.getItem('language')).toUpperCase()
    );
    return this.httpClient.get<Association[]>(`api/BICTest/GetAssociations`, {
      params,
    });
  }

  public deleteConcept(id: string): Observable<any> {
    return this.httpClient.delete<any>(`api/BICTest/DeleteTestConcept/${id}`);
  }

  public calcTestBIC(data: CalcTestData): Observable<any> {
    return this.httpClient.post<any>(`api/BICTest/CalcTest`, data);
  }

  public calcTestTimeBIC(data: CalcTimeModel): Observable<number> {
    return this.httpClient.post<number>(`api/BICTest/CalcTestTime`, data);
  }

  public copyTest(testId: string, testName: string): Observable<string> {
    const params = new HttpParams()
      .set('testId', testId)
      .set('testName', testName);
    return this.httpClient.get<string>(`api/BICTest/CopyTest`, { params });
  }
}
