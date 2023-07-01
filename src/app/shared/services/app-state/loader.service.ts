import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private isLoadingBackground: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public getValue(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  public changeLoadingState(isLoading: boolean): void {
    this.loadingState.next(isLoading);
  }

  public getLoadingBackgroundValue(): Observable<boolean> {
    return this.isLoadingBackground.asObservable();
  }

  public setLoadingBackgroundValue(value: boolean): void {
    this.isLoadingBackground.next(value);
  }
}
