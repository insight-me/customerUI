import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CutBySlashPipe } from './cut-by-slash/cut-by-slash.pipe';
import { DateFormatPipe } from './date-format/date-format.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { NumberToLocaleStringPipe } from './number-to-string-locale/number-to-string-locale.pipe';
import { SafeHtmlPipe } from './save-html/save-html.pipe';
import { TranslateInPipe } from './translate-custom.pipe';

const commonModules = [
  CommonModule,
];

const commonDeclarations = [
  DateFormatPipe,
  SafeHtmlPipe,
  NumberToLocaleStringPipe,
  TranslateInPipe
];

@NgModule({
  imports: [...commonModules],
  declarations: [...commonDeclarations, LocalizedDatePipe, CutBySlashPipe],
  providers: [],
  exports: [...commonModules, ...commonDeclarations, LocalizedDatePipe, CutBySlashPipe]
})
export class SharedPipesModule { }
