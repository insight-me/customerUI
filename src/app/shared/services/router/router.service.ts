import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {changeMetaToMobile} from '../../utils/change-meta.utils';
import {NgcCookieConsentService} from 'ngx-cookieconsent';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router,
              private ccService: NgcCookieConsentService) { }

  public setRouterEventSubscription(): void {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          if (event.url === '/privacy-policy') {
            this.ccService.destroy();
          }
          if (event.url !== '/personal-area/custom-segmentation'
            && event.url !== '/personal-area/custom-segmentation/create-segmentation') {
            changeMetaToMobile();
          }
        }
        window.scrollTo(0, 0);
      });
  }
}
