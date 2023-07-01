import { APP_INITIALIZER, Injectable, OnInit, Provider } from '@angular/core';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../configs/translate.config';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppStateService } from '../app-state/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private translateService: TranslateService,
    private appStateService: AppStateService
  ) {}

  public loadConfigurationAndSetLanguages(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.setLanguages());
    });
  }

  public updateLanguage(lang: string): Observable<any> {
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('language', JSON.stringify(lang));
    return this.translateService.use(lang);
  }

  public setLanguages(): void {
    this.translateService.addLangs(
      LANGUAGES.map((lang: any) => lang.id.toString())
    );
    const savedLang = JSON.parse(localStorage.getItem('language'));
    const browserLang = savedLang
      ? savedLang
      : this.translateService.getBrowserLang();
    // const currentLang = ['en', 'se'].includes(browserLang) ? browserLang : 'en';
    const currentLang = ['en'].includes(browserLang) ? browserLang : 'en';
    this.appStateService.language.next(currentLang);
    this.appStateService.language.subscribe((lang) => {
      this.updateLanguage(lang);
    });
  }
}

export function loadConfigurationAndSetLanguages(
  configService: ConfigurationService
): () => Promise<any> {
  return (): Promise<any> => configService.loadConfigurationAndSetLanguages();
}

export const CONFIGURATION_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: loadConfigurationAndSetLanguages,
  deps: [ConfigurationService],
};
