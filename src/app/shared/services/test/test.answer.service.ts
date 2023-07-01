import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestAnswerService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public generateBicAnswers(testId: string, answersCount: number): Observable<any> {
    const params = new HttpParams()
      .set('testId', testId)
      .set('answersCount', answersCount.toString());
    return this.httpClient.post<any>('api/TestAnswer/GenerateBICAnswers', {}, {params});
  }
}
