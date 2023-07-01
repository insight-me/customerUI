import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor as Interceptor, HttpRequest, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/app-state/loader.service';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoaderInterceptorService implements Interceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loadingService: LoadingService) {
  }

  private removeRequest(req: HttpRequest<any>): void {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loadingService.changeLoadingState(this.requests.length > 0);
  }

  // tslint:disable-next-line:no-any
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('api/Tag/GetTriggers')
      // && !req.url.includes('api/TestResult/ExportPDF')
      && !req.url.includes('api/BICTest/CalcTest')
      && !req.url.includes('api/BTTest/CalcTest')) {
      this.requests.push(req);
      this.loadingService.changeLoadingState(true);
    }
    return next.handle(req).pipe(
      finalize(() => {
        this.removeRequest(req);
      })
    );
  }
}
