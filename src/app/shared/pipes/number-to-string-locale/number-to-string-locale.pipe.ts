import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToLocaleString',
})
export class NumberToLocaleStringPipe implements PipeTransform {
  transform(value: number, locales?: string | string[], options?: any): string {
    return value?.toLocaleString(locales, options);
  }
}
