import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RespondentOptions } from '../models/test-creation.model';
import { AppStateService } from '../services/app-state/app-state.service';
import { TestService } from '../services/test/test.service';

@Injectable({
  providedIn: 'root',
})
export class RespondentOptionsResolver implements Resolve<RespondentOptions> {
  constructor(private appStateService: AppStateService, private testService: TestService) { }

  resolve(): Observable<RespondentOptions> | RespondentOptions {
    const test = this.testService.test;


    if (this.appStateService.respondentOptions$.getValue()) {
      return this.appStateService.respondentOptions$.getValue();
    }

    return this.testService.getRespondentOptions(test.sv);
  }
}
