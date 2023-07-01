import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MainPageService {
  public scrollToContactUs$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor() {}
}
