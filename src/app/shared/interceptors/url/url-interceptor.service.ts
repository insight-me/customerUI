import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor as Interceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { includes } from 'lodash';
import { LoadingService } from '../../services/app-state/loader.service';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from '../../services/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class UrlInterceptorService implements Interceptor {
  private excludedUrlsRegex: RegExp[];
  private excludedUrls = ['.svg'];

  constructor(
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {
    this.excludedUrlsRegex =
      this.excludedUrls.map((urlPattern) => new RegExp(urlPattern, 'i')) || [];
  }

  // tslint:disable-next-line:no-any
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const passThrough: boolean = !!this.excludedUrlsRegex.find((regex) =>
      regex.test(req.url)
    );

    if (passThrough) {
      return next.handle(req).pipe(
        finalize(() => {
          // this.loadingService.changeLoadingState(false);
        })
      );
    }
    const isSocialRequest = req.headers.has('targetSocial');
    let url = '';
    if (isSocialRequest) {
      url = req.url;
    } else {
      url = this.fullUrl(req.url);
    }
    const apiReq = req.clone({
      url,
      // withCredentials: true,
    });
    if (navigator.onLine) {
      return next.handle(apiReq).pipe(
        tap((resp) => {
          if (
            resp instanceof HttpResponse &&
            includes(apiReq.url, environment.serverURL)
          ) {
            // this.loadingService.changeLoadingState(false);
          }
        })
        // finalize(() => {
        //   this.loadingService.changeLoadingState(false);
        // })
      );
    } else {
      if (!apiReq.url.includes('assets/images')) {
        this.toastService.showMessage(
          'err',
          't-toast.Failed',
          't-toast.Please check your internet connection and try again'
        );
      }
      this.loadingService.changeLoadingState(false);
      return EMPTY;
    }
  }

  private fullUrl(url: string): string {
    const prefixUrl = includes(url, 'assets')
      ? window.location.origin
      : environment.serverURL;
    return `${prefixUrl}${url}`;
  }
}
