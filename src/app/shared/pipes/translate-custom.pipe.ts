import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomTranslateService } from '../services/custom-translate.service';

@Pipe({
  name: 'translateCustom'
})
export class TranslateInPipe implements PipeTransform {
  private translations: Record<string, any>;

  constructor(private _customTranslateService: CustomTranslateService, private _translateService: TranslateService) {
    this.translations = this._customTranslateService.translations ?? this._getDefaultLang();
  }

  public transform(key: string, subKey?: Record<string, any>): string {
    const subKeyReg = /{{(.*?)}}/gm;

    if (!key) {
      return '';
    }

    const dotIndex = key.indexOf('.');
    const parentKey = dotIndex !== -1 ? key.substring(0, dotIndex) : key;
    const nestedKey = dotIndex !== -1 ? key.substring(dotIndex + 1) : '';

    if (subKey) {
      let result: string;
      for (const item in subKey) {
        result = (this.translations[parentKey][nestedKey] as string)?.replace(subKeyReg, subKey[item]);
      }
      return result;
    }

    return this.translations[parentKey][nestedKey];
  }

  private _getDefaultLang(): Record<string, any> {
    const currentLang = JSON.parse(localStorage.getItem('language'));
    return this._translateService.store.translations[currentLang];
  }
}
