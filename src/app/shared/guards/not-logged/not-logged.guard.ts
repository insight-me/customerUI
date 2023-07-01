import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../../services/app-state/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NotLoggedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private localStorageService: LocalStorageService
  ) {}

  public canActivate(): boolean {
    if (this.localStorageService.get().accessToken) {
      this.router.navigate(['personal-area/dashboard']);
      return false;
    }
    this.localStorageService.remove();
    return true;
  }
}
