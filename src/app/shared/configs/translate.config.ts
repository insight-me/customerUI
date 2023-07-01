import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export enum TranslateLanguagesEnum {
  ENGLISH = 'en',
  GERMAN = 'de',
  SWEDEN = 'se',
}

export enum LanguagesEnum {
  'EN' = 'English',
  'SE' = 'Sweden',
}

export function TranslateLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export const TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: TranslateLoaderFactory,
    deps: [HttpClient],
  },
};

export const LANGUAGES: any[] = [
  {
    id: TranslateLanguagesEnum.ENGLISH,
    value: 'English',
  },
  {
    id: TranslateLanguagesEnum.GERMAN,
    value: 'German',
  },
];

export const DEFAULT_LANGUAGE: any = {
  id: TranslateLanguagesEnum.ENGLISH,
  value: 'English',
};
