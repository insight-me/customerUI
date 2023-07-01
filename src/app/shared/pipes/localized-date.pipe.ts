import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localizedDate',
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: Date | string, format = 'mediumDate'): string {
    const datePipe = new DatePipe(this.translateService.currentLang === 'se' ? 'sv' : 'en');
    return datePipe.transform(value, format);
  }
}
