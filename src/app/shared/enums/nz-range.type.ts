import { TimeInternal } from 'src/app/shared/enums/period.enum';
export enum NzCalendarMode {
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  Year = 'year',
}

export const NzCalendarModeMap = new Map([
  [TimeInternal.Weekly, NzCalendarMode.Week],
  [TimeInternal.Monthly, NzCalendarMode.Month],
  [TimeInternal.Quarterly, NzCalendarMode.Quarter],
  [TimeInternal.Yearly, NzCalendarMode.Year],
]);
