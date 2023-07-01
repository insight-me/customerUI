import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Tokens, User } from '../../models/user.model';
import { LocalStorageService } from '../app-state/local-storage.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppStateService } from '../app-state/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private refreshTokenTimeout;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
    private appStateService: AppStateService
  ) {}

  public login(body: { mail: string; password: string }): Observable<any> {
    return this.httpClient.get<any>(`api/Account/SignIn`, { params: body });
  }

  public logout(): Observable<any> {
    return this.httpClient.get<any>(`api/Account/Logout`);
  }

  public refreshToken(): Observable<any> {
    const body = { refreshToken: this.localStorageService.get().refreshToken };
    return this.httpClient.post<any>(`api/Account/Refresh-token`, body).pipe(
      map((res: Tokens) => {
        this.localStorageService.set(res);
        this.startRefreshTokenTimer();
        return res;
      })
    );
  }

  public verifyEmail(params): Observable<User> {
    return this.httpClient.get<User>(`api/Account/Confirm`, { params });
  }

  public registerUser(body: User): Observable<User> {
    return this.httpClient.post<User>(`api/Account/SignUp`, body);
  }

  public resendEmail(params: any): Observable<any> {
    return this.httpClient.get<any>(`api/Account/ReVerification`, { params });
  }

  public setInviteUserPassword(params: any): Observable<any> {
    return this.httpClient.get<any>(`api/Account/SetInviteUserPassword`, {
      params,
    });
  }

  public requestResetPassword(params: { email: string }): Observable<any> {
    return this.httpClient.get<any>('api/Account/PasswordRecoveryInitial', {
      params,
    });
  }

  public passwordResetConfirm(params: {
    email: string;
    code: string;
  }): Observable<any> {
    return this.httpClient.get<any>(
      'api/Account/PasswordRecoveryConfirmation',
      { params }
    );
  }

  public passwordResetComplete(params: {
    email: string;
    code: string;
    password: string;
  }): Observable<any> {
    return this.httpClient.get<any>('api/Account/PasswordRecovery', { params });
  }

  public checkInvitationLink(userId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `api/Account/CheckInviteLink/${userId}`
    );
  }

  public startRefreshTokenTimer(): void {
    const expires = this.getExpiresAccessToken();
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () =>
        this.refreshToken().subscribe(
          () => {},
          () => {
            this.resetUser();
          }
        ),
      timeout
    );
  }

  public getExpiresAccessToken(): Date {
    const jwtToken = JSON.parse(
      atob(this.localStorageService.get().accessToken.split('.')[1])
    );

    // set a timeout to refresh the token a minute before it expires
    return new Date(jwtToken.exp * 1000);
  }

  public stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  public resetUser(): void {
    this.localStorageService.remove();
    this.stopRefreshTokenTimer();
    this.appStateService.deleteCurrentUser();
    this.router.navigate(['auth/login']);
  }
}
