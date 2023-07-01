import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';
import { IS_COOKIE_ALLOWED } from '../assets/consts/consts';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from './shared/services/app-state/app-state.service';
import { RouterService } from './shared/services/router/router.service';
import { GoogleAnalyticsService } from './shared/services/google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CookieService],
})
export class AppComponent implements OnInit, OnDestroy {
  private lang: string;
  private subscriptions: Subscription = new Subscription();
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;

  constructor(
    private router: Router,
    private routerService: RouterService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private ccService: NgcCookieConsentService,
    private translateService: TranslateService,
    private appStateService: AppStateService,
    private cookieService: CookieService,
  ) {}

  public ngOnInit(): void {
    this.googleAnalyticsService.addGAScript();
    this.googleAnalyticsService.setUpAnalytics();
    this.routerService.setRouterEventSubscription();
    this.appStateService.language.subscribe((lang) => {
      if (!this.cookieService.get(IS_COOKIE_ALLOWED) && this.lang !== lang) {
        this.setTranslationForCookies();
      }
      this.lang = lang;
    });
    this.setTranslationForCookies();
    this.setCookiesSubscriptions();
  }

  public ngOnDestroy(): void {
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  private setTranslationForCookies(): void {
    this.translateService
      .get([
        'cookie.message',
        'cookie.allow',
        'cookie.deny',
        'cookie.link',
        'cookie.policy',
      ])
      .subscribe((data) => {
        this.ccService.getConfig().content =
          this.ccService.getConfig().content || {};
        this.ccService.getConfig().content.message = data['cookie.message'];
        this.ccService.getConfig().content.allow = data['cookie.allow'];
        this.ccService.getConfig().content.deny = data['cookie.deny'];
        this.ccService.getConfig().content.link = data['cookie.link'];
        this.ccService.getConfig().content.policy = data['cookie.policy'];
        this.ccService.destroy();
        this.ccService.init(this.ccService.getConfig());
      });
  }

  private setCookiesSubscriptions(): void {
    this.statusChangeSubscription = this.subscriptions.add(
      this.ccService.statusChange$.subscribe((event: NgcStatusChangeEvent) => {
        if (event.status === 'allow') {
          this.cookieService.set(IS_COOKIE_ALLOWED, 'true');
          this.ccService.destroy();
        } else {
          this.cookieService.delete(IS_COOKIE_ALLOWED);
        }
      })
    );
    const isCookieAllowed = this.cookieService.get(IS_COOKIE_ALLOWED);
    if (isCookieAllowed === 'true') {
      this.ccService.destroy();
    }
  }
}
