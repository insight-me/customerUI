import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor as Interceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from '../../services/app-state/local-storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements Interceptor {
  private readonly UNAUTHORIZED = 401;
  private readonly PAYMENT_REQUIRED = 402;
  private readonly FORBIDDEN = 403;
  private readonly NOT_FOUND = 404;
  private readonly UNPROCESSABLE_ENTITY = 422;
  private readonly SERVER_ERROR = 500;
  private readonly NO_INTERNET_CONNECTION = 0;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  // tslint:disable-next-line: no-any
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // tslint:disable-next-line:no-any
      catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        switch (error.status) {
          case this.UNAUTHORIZED:
            this.authService.resetUser();
            break;
          case this.NO_INTERNET_CONNECTION:
            if (!request.url.includes('assets/images')) {
              this.toastService.showMessage(
                'err',
                't-toast.Failed',
                't-toast.Please check your internet connection and try again'
              );
              return EMPTY;
            }
        }
        return throwError(error);
      })
    );
  }
}
