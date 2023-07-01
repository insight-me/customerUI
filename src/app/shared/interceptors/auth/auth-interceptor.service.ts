import { LocalStorageService } from '../../services/app-state/local-storage.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor as Interceptor, HttpRequest, } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements Interceptor {
  constructor(private localStorageService: LocalStorageService) {
  }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const tokens = this.localStorageService.get();
    if (tokens.accessToken) {
      // if (req.url.split('/')[req.url.split('/').length - 1] === 'Refresh-token') {
      //   req = req.clone({
      //     url: req.url
      //   });
      // } else {
      //   req = req.clone({
      //     url: req.url,
      //     setHeaders: {
      //       Authorization: `Bearer ${tokens.accessToken}`
      //     }
      //   });
      // }
      req = req.clone({
        url: req.url,
        setHeaders: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      });
    }

    return next.handle(req);
  }
}
