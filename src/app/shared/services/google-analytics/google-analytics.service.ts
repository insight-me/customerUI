import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
// tslint:disable-next-line:ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(private router: Router) { }

  public addGAScript(): void {
    const gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.GA_TRACKING_ID;
    document.head.prepend(gtagScript);
    gtag('config', environment.GA_TRACKING_ID, {send_page_view: false});
  }

  public setUpAnalytics(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', environment.GA_TRACKING_ID,
          {
            page_path: event.urlAfterRedirects
          }
        );
      });
  }
}
