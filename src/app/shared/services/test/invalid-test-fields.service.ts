import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvalidTestFieldsService {
  public invalidFields = {};
  public invalidRespondentsPerSegments = {};

  constructor() {
  }

  public setInvalidField(id: string, field: any): void {
    this.invalidFields[id] = field;
  }

  public getInvalidField(id: string): any {
    return this.invalidFields[id];
  }

  public setInvalidRespondentsPerSegments(testId: string, countryId: string): void {
    if (!this.invalidRespondentsPerSegments[testId]) {
      this.invalidRespondentsPerSegments[testId] = [];
    }
    if (!this.isInvalidRespondentsPerSegments(testId, countryId)) {
      this.invalidRespondentsPerSegments[testId].push({
        countryId,
      });
    }
  }

  public isInvalidRespondentsPerSegments(testId: string, countryId: string): any {
    return this.invalidRespondentsPerSegments[testId]?.find((field) => field.countryId === countryId);
  }

  // public setInvalidRespondentsPerSegments(testId: string, countryId: string, segmentId: string, respondentCount: number): void {
  //   if (!this.invalidRespondentsPerSegments[testId]) {
  //     this.invalidRespondentsPerSegments[testId] = [];
  //   }
  //   this.invalidRespondentsPerSegments[testId].push({
  //     countryId,
  //     segmentId,
  //     respondentCount,
  //   });
  // }

  // public isInvalidRespondentsPerSegments(testId: string, countryId: string, segmentId: string): boolean {
  //   return this.invalidRespondentsPerSegments[testId]?.find((field) => field.countryId === countryId && field.segmentId === segmentId);
  // }
  //
  // public getInvalidRespondentsPerSegments(testId: string): void {
  //   return this.invalidRespondentsPerSegments[testId];
  // }
  //
  public removeInvalidRespondentsPerSegments(testId: string, countryId: string): void {
    if (this.isInvalidRespondentsPerSegments(testId, countryId)) {
      const i = this.invalidRespondentsPerSegments[testId]?.findIndex((field) =>
        field.countryId === countryId);
      this.invalidRespondentsPerSegments[testId]?.splice(i, 1);
    }
  }

  //
  // public updateInvalidField(testId: string, countryId: string, segmentId: string, respondentCount: number): void {
  //   const i = this.invalidRespondentsPerSegments[testId]?.findIndex((field) =>
  //     field.countryId === countryId && field.segmentId === segmentId);
  //   this.invalidRespondentsPerSegments[testId][i].respondentCount = respondentCount;
  // }
}
