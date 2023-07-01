import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppStateService } from '../services/app-state/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<boolean> {
  constructor(private appStateService: AppStateService) {}

  resolve(): boolean {
    this.appStateService.getUser();
    return true;
  }
}
