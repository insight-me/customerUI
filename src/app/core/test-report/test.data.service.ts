import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TestDataService {
  public testName$: Observable<string>;
}
