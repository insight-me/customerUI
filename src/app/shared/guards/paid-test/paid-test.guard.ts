import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TestService } from '../../services/test/test.service';
import { switchMap } from 'rxjs/operators';
import { LocalStorageService } from '../../services/app-state/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PaidTestGuard implements CanActivate {
  constructor(
    private testService: TestService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.testService.getTestById(route.children[0].params.id).pipe(
      switchMap((test) => {
        if (test.isDraft) {
          return of(true);
        }
        this.router.navigate(['personal-area/test-library']);
        return of(false);
      })
    );
  }
}
