import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { FilterModel } from '../../models/library.model';
import { RespondentOptions } from '../../models/test-creation.model';
import { LibraryTest, QuickTest, Test } from '../../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  public test: Test;
  constructor(private httpClient: HttpClient) { }

  public updateMoodBoard(body: any): Observable<any> {
    return this.httpClient.put<any>(`api/Test/MoodBoard`, body);
  }

  public getTestById(testId: string): Observable<Test> {
    return this.httpClient.get<any>(`api/Test/${testId}`).pipe(tap(res => this.test = res));
  }

  public updateTest(body: Test): Observable<Test> {
    return this.httpClient.put<Test>(`api/Test`, body);
  }

  public createConcept(body: any): Observable<any> {
    return this.httpClient.post<any>(`api/Test/CreateTestConcept`, body);
  }

  public getRespondentOptions(sv: number, language?: string): Observable<RespondentOptions> {
    const params = new HttpParams().set('language', language ?? JSON.parse(localStorage.getItem('language')).toUpperCase())
      .set('sv', sv?.toString());
    return this.httpClient.get<RespondentOptions>(`api/Test/RespondentRequirementOptions`, {
      params,
    });
  }


  public getTests(): Observable<LibraryTest[]> {
    return this.httpClient.get<LibraryTest[]>(`api/Test`).pipe(shareReplay());
  }

  public getQuickTests(): Observable<QuickTest[]> {
    return this.httpClient.get<QuickTest[]>(`api/Test/QuickTestsModel`).pipe(shareReplay());
  }

  public deleteConcept(id: string): Observable<any> {
    return this.httpClient.delete<any>(`api/Test/DeleteTestConcept/${id}`);
  }

  public deleteTest(testId: string): Observable<any> {
    return this.httpClient.delete<any>(`api/Test/${testId}`);
  }

  public getCustomSegments(): Observable<any> {
    return this.httpClient.get<any>(`api/Test/GetCustomSegments`);
  }

  public getFilteredTests(reqBody: FilterModel): Observable<any> {
    return this.httpClient.post<any>(`api/Test/GetAllByFilter`, reqBody);
  }

  public getTotalPages(reqBody: FilterModel): Observable<any> {
    return this.httpClient.post<any>(`api/Test/CountByFilter`, reqBody);
  }
}
