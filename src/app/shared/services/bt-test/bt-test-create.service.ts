import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BtTestService } from './bt-test.service';

@Injectable({
  providedIn: 'root',
})
export class BtTestCreateService {
  public nextRoute: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public testId = '';
  public currentTest: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public testPriceAndTime: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private btTestService: BtTestService) { }

  public get test(): Observable<any> {
    return this.currentTest.asObservable();
  }

  public set test(test) {
    this.currentTest.next(test);
  }

  public getTest(testId?: string): void {
    if (!testId) {
      testId = this.testId;
    }
    this.btTestService.getTestById(testId).subscribe(res => {
      this.currentTest.next(res);
    });
  }

  public getPriceAndTime(): void {
    this.btTestService.getTestPriceAndTime().subscribe(res => {
      this.testPriceAndTime.next(res);
    });
  }
}
