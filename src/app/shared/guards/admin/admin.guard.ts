import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../../services/app-state/local-storage.service';
import { AppStateService } from '../../services/app-state/app-state.service';
import { RoleType } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { switchMap, switchMapTo } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private readonly router: Router, private appStateService: AppStateService, private userService: UserService) {}

  public canActivate(): Observable<boolean> {
    return this.appStateService.getUserInfoForGuard().pipe(switchMap(user => {
      if (user?.securityLevel !== RoleType.Manager) {
        return of(true);
      }
      return of(false);
    }));
  }
}
