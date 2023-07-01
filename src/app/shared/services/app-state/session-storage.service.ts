import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private concepts: string[] = [];
  public concepts$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor() {
  }

  public set(step: string): void {
    sessionStorage.setItem(step, step);
  }

  public get(step: string): string {
    return sessionStorage.getItem(step);
  }

  public setConcept(id: string): void {
    this.concepts.push(id);
    this.concepts$.next(this.concepts);
  }

  public getConcept(): Observable<string[]> {
    return this.concepts$.asObservable();
  }

  public setBt(id: string): void {
    sessionStorage.setItem(id, id);
  }

  public getBt(id: string): string {
    return sessionStorage.getItem(id);
  }
}
