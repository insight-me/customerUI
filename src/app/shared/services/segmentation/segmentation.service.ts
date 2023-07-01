import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomSegmentation,
  CustomSegments,
  UpsertCustomSegmentCoefficients,
  UpsetSegmentationQuestions,
  UpsetSegments
} from '../../models/custom-segmentation.model';

@Injectable({
  providedIn: 'root'
})
export class SegmentationService {

  constructor(private httpClient: HttpClient) {
  }

  // public getCustomSegmentationQuestions(testId: string): Observable<any> {
  //   return this.httpClient.get<any>(`api/Test/CustomSegmentationQuestions/${testId}`);
  // }

  public getCustomSegments(): Observable<CustomSegments> {
    return this.httpClient.get<CustomSegments>(`api/Test/CustomSegments`);
  }

  public upsertCustomSegments(body: UpsetSegments): Observable<CustomSegmentation> {
    return this.httpClient.post<CustomSegmentation>(`api/Test/UpsertCustomSegments`, body);
  }

  public upsertCustomSegmentQuestions(body: UpsetSegmentationQuestions): Observable<CustomSegmentation> {
    return this.httpClient.post<CustomSegmentation>(`api/Test/UpsertCustomSegmentQuestions`, body);
  }

  public setCustomSegmentationMinMaxValue(body: { minValue: number, maxValue: number }): Observable<void> {
    return this.httpClient.post<void>(`api/Test/SetCustomSegmentationMinMaxValue`, body);
  }

  public upsertCustomSegmentCoefficients(body: UpsertCustomSegmentCoefficients): Observable<CustomSegmentation> {
    return this.httpClient.post<CustomSegmentation>(`api/Test/UpsertCustomSegmentCoefficients`, body);
  }
}
