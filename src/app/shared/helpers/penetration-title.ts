import { TranslateService } from '@ngx-translate/core';
export function penetrationTitle(penetrationInMonthes: number, ts: TranslateService): string {
  if (penetrationInMonthes === 1) {
    return `${ts.instant('report.month')}`;
  }

  if (penetrationInMonthes > 0 && penetrationInMonthes < 11) {
    return `${penetrationInMonthes} ${ts.instant('report.months')}`;
  }

  if (penetrationInMonthes === 12) {
    return `${ts.instant('report.year')}`;
  }

  if (penetrationInMonthes > 12) {
    return `${monthsToYears(penetrationInMonthes)} ${ts.instant('report.years')}`;
  }

  return `${ts.instant('report.month')}`;
}




function monthsToYears(penetrationInMonthes: number): number | string {
  switch (penetrationInMonthes) {
    case 12:
    default:
      return '';
    case 24: return 2;
    case 36: return 3;
  }
}
