import { AgmCoreModule } from '@agm/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeSe from '@angular/common/locales/sv';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { enGB } from 'date-fns/locale';
import { en_US, NZ_DATE_CONFIG, NZ_DATE_LOCALE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { MessageService } from 'primeng/api';
import { cookieConfig } from '../assets/configuration/cookie.config';
import { AppComponent } from './app.component';
import { RootModule } from './core/root/root.module';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { TRANSLATE_MODULE_CONFIG } from './shared/configs/translate.config';
import { appInitializer } from './shared/helpers/app.initializer';
import { InterceptorsModule } from './shared/interceptors/interceptors.module';
import { LegalModule } from './shared/legal/legal.module';
import { LocalStorageService } from './shared/services/app-state/local-storage.service';
import { AuthService } from './shared/services/auth/auth.service';
import { CONFIGURATION_PROVIDER } from './shared/services/configuration/configuration.service';

registerLocaleData(localeEn);
registerLocaleData(localeSe);

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    RootModule,
    SharedComponentsModule,
    LegalModule,
    BrowserAnimationsModule,
    InterceptorsModule,
    AngularSvgIconModule.forRoot(),
    TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQUiPnANkimkLc2RNQIiObzpm1al9YME8',
      libraries: ['places'],
      language: 'en',
    }),
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],
  bootstrap: [AppComponent],
  providers: [
    MessageService,
    CONFIGURATION_PROVIDER,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService, LocalStorageService],
    },
    { provide: LOCALE_ID, useValue: 'en-US' },
    {
      provide: NZ_DATE_CONFIG,
      useValue: {
        firstDayOfWeek: 1
      },
    },
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_DATE_LOCALE, useValue: enGB }
  ],
})
export class AppModule { }
