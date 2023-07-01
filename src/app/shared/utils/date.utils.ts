import * as moment from 'moment';
import { DAYS_ON_MONTH_END } from '../../../assets/consts/test-creation.const';
import { NzCalendarMode } from '../enums/nz-range.type';

export function isCurrentMonthSuitable(): boolean {
  return new Date(new Date().setDate(new Date().getDate() + DAYS_ON_MONTH_END)).getMonth() === new Date().getMonth();
}

export function addDaysToDate(date: Date, numberOfDays: number): Date {
  return new Date(date.setDate(date.getDate() + numberOfDays));
}

export function getCorrectDateOfNextMonth(): Date {
  return moment().add(1, 'month').set('date', 2).toDate();
}

export function isLateStartDate(date: Date): boolean {
  return moment(date).isBefore(moment());
}

export function isValidStartDate(date: Date): boolean {
  return !date;
}

export function isValidStartDateFormat(value): boolean {
  const tomorrow = new Date();
  const today = new Date();
  tomorrow.setDate(today.getDate() + 1);
  let formatTomorrow = moment(tomorrow).format('YYYY-MM-DD');
  let formatValue = moment(value).format('YYYY-MM-DD');
  return formatTomorrow === formatValue;
}

export function getFirstDayOfWeek(weekYear: string): string {
  const [yearString, weekString] = weekYear.split('-');
  const year = +yearString;
  const week = +weekString;

  const januaryFirst = new Date(year, 0, 1);
  const dayOfWeekJanuaryFirst = januaryFirst.getDay();
  const daysOffset = (dayOfWeekJanuaryFirst > 1) ? dayOfWeekJanuaryFirst - 1 : 6;
  const firstMonday = new Date(year, 0, 1 + (7 - daysOffset));
  const weekStartDate = new Date(firstMonday.getTime() + ((week - 1) * 7 * 24 * 60 * 60 * 1000));
  weekStartDate.setHours(0, 0, 0, 0);

  weekStartDate.setUTCHours(weekStartDate.getUTCHours() + 3);
  const isoString = weekStartDate.toISOString();
  return isoString;
}

export function getFirstDayOfMonth(monthYear: string): string {
  const [yearString, monthString] = monthYear.split('-');
  const year = +yearString;
  const month = +monthString - 1;

  const firstDayOfMonth = new Date(year, month, 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  firstDayOfMonth.setUTCHours(firstDayOfMonth.getUTCHours() + 3);
  const isoString = firstDayOfMonth.toISOString();
  return isoString;
}

export function getFirstDayOfYear(yearString: string): string {
  const year = +yearString;
  const firstDayOfYear = new Date(year, 0, 1);
  firstDayOfYear.setHours(0, 0, 0, 0);
  firstDayOfYear.setUTCHours(firstDayOfYear.getUTCHours() + 3);
  const isoString = firstDayOfYear.toISOString();
  return isoString;
}

export function getFirstDayOfQuarter(quarterString: string): string {
  const quarter = +quarterString.substring(1, 2);
  const year = +quarterString.substring(2);
  const month = (quarter - 1) * 3;
  const firstDayOfQuarter = new Date(year, month, 1);
  firstDayOfQuarter.setHours(0, 0, 0, 0);
  const isoString = firstDayOfQuarter.toISOString();
  return isoString;
}


export function getLastDayOfWeek(weekYear: string): string {
  const [yearString, weekString] = weekYear.split('-');
  const year = +yearString;
  const week = +weekString;

  const januaryFirst = new Date(year, 0, 1);
  const dayOfWeekJanuaryFirst = januaryFirst.getDay();
  const daysOffset = (dayOfWeekJanuaryFirst > 1) ? dayOfWeekJanuaryFirst - 1 : 6;
  const firstMonday = new Date(year, 0, 1 + (7 - daysOffset));
  const weekStartDate = new Date(firstMonday.getTime() + ((week - 1) * 7 * 24 * 60 * 60 * 1000));
  const weekEndDate = new Date(weekStartDate.getTime() + (6 * 24 * 60 * 60 * 1000));
  weekEndDate.setHours(23, 59, 59, 999);

  const isoString = weekEndDate.toISOString();
  return isoString;
}

export function getLastDayOfMonth(monthYear: string): string {
  const [yearString, monthString] = monthYear.split('-');
  const year = +yearString;
  const month = +monthString - 1;


  const firstDayOfNextMonth = new Date(year, month + 1, 1);
  const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - (24 * 60 * 60 * 1000));
  lastDayOfMonth.setHours(23, 59, 59, 999);

  const isoString = lastDayOfMonth.toISOString();
  return isoString;
}

export function getLastDayOfQuarter(quarterString: string): string {
  const quarter = +quarterString.substring(1, 2);
  const year = +quarterString.substring(2);

  const month = (quarter - 1) * 3 + 2;
  const lastDayOfMonth = new Date(year, month + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  const isoString = lastDayOfMonth.toISOString();
  return isoString;
}


export function getLastDayOfYear(yearString: string): string {
  const year = +yearString;
  const lastDayOfYear = new Date(year, 11, 31);
  lastDayOfYear.setHours(23, 59, 59, 999);
  const isoString = lastDayOfYear.toISOString();
  return isoString;
}

export function calcFirstDateValue(inputValue: string, calendarMode: NzCalendarMode): string {
  switch (calendarMode) {
    case NzCalendarMode.Week:
    default: return getFirstDayOfWeek(inputValue);
    case NzCalendarMode.Month: return getFirstDayOfMonth(inputValue);
    case NzCalendarMode.Quarter: return getFirstDayOfQuarter(inputValue);
    case NzCalendarMode.Year: return getFirstDayOfYear(inputValue);
  }
}

export function calcLastDateValue(inputValue: string, calendarMode: NzCalendarMode): string {
  switch (calendarMode) {
    case NzCalendarMode.Week:
    default: return getLastDayOfWeek(inputValue);
    case NzCalendarMode.Month: return getLastDayOfMonth(inputValue);
    case NzCalendarMode.Quarter: return getLastDayOfQuarter(inputValue);
    case NzCalendarMode.Year: return getLastDayOfYear(inputValue);
  }
}

export function getDateForWeek(): Date {
  const currentDate = new Date();
  const previousWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  // tslint:disable-next-line: max-line-length
  const endOfPreviousWeek = new Date(previousWeek.getFullYear(), previousWeek.getMonth(), previousWeek.getDate() + (6 - previousWeek.getDay()));
  return endOfPreviousWeek;
}

export function getDateForMonth(): Date {
  const currentDate = new Date();
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
  const endOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
  return endOfPreviousMonth;
}

export function getDateForQuarter(): Date {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentQuarter = Math.floor(currentMonth / 3);

  const previousQuarterStartMonth = currentQuarter * 3 - 3;
  const previousQuarterStartDate = new Date(currentDate.getFullYear(), previousQuarterStartMonth, 1);

  const previousQuarterEndDate = new Date(previousQuarterStartDate.getFullYear(), previousQuarterStartDate.getMonth() + 3, 0);

  return previousQuarterEndDate;
}

export function getDateForYear(): Date {
  const currentDate = new Date();
  const previousYear = new Date(currentDate.getFullYear() - 1, 11, 31);
  return previousYear;
}

/**
 * Returns the last completed quarter relative to the current day.
 * The function determines the last completed quarter based on the current month and year.
 * It returns the quarter in the format "QXYYYY", where X represents the quarter number (1-4) and YYYY represents the year.
 *
 * @returns {string} The last completed quarter in the format "QXYYYY"
 */

export function getLastCompletedQuarter(): string {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let quarter: string;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = `Q4${currentYear - 1}`;
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = `Q1${currentYear}`;
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = `Q2${currentYear}`;
  } else {
    quarter = `Q3${currentYear}`;
  }

  return quarter;
}


