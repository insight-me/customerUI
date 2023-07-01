import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppStateService } from '../services/app-state/app-state.service';
import { catchError, filter, first, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Company } from '../models/company.model';
import { UserService } from '../services/user/user.service';
import { CompanyService } from '../services/company/company.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyResolver implements Resolve<Company> {
  constructor(
    private appStateService: AppStateService,
    private userService: UserService,
    private companyService: CompanyService
  ) {}

  public resolve(): Observable<Company> {
    return this.userService.getUserInfo().pipe(
      first(),
      filter((user: User) => !!user),
      switchMap((user: User) => {
        this.appStateService.setCurrentUser(user);
        if (
          this.appStateService.language.getValue() !==
          user.preferredLanguage.toLowerCase()
        ) {
          this.appStateService.changeLanguage(
            user.preferredLanguage.toLowerCase()
          );
        }
        return this.companyService.getCompanyById(user.companyId);
      }),
      tap((company: Company) => this.appStateService.setCurrentCompany(company))
    );
  }
}
