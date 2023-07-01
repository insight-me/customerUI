export function isBefore(selectedQuarter: Date, quarter: Date): boolean {
  return quarter.getTime() < selectedQuarter.getTime();
}

export function isAfter(selectedQuarter: Date, quarter: Date): boolean {
  return quarter.getTime() > selectedQuarter.getTime();
}

/**
 * Converts a Date object representing a quarter into a string representation.
 * @param {Date} date - The Date object representing the quarter.
 * @returns {string} - The string representation of the quarter (e.g., "Q1-2023").
 */

export function reverseParseQuarter(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  let quarter;

  if (month >= 0 && month < 3) {
    quarter = 'Q1';
  } else if (month >= 3 && month < 6) {
    quarter = 'Q2';
  } else if (month >= 6 && month < 9) {
    quarter = 'Q3';
  } else {
    quarter = 'Q4';
  }

  return `${quarter}${year}`;
}

/**
 * Parses a string representation of a quarter into a Date object.
 * @param {string} quarterStr - The string representation of the quarter (e.g., "Q1-2023").
 * @returns {Date} - The Date object representing the first day of the specified quarter.
 * @throws {Error} - If the provided quarter string is invalid.
 */

export function parseQuarter(quarterStr: string): Date {
  const quarter = quarterStr?.slice(0, 2);
  const yearStr = quarterStr?.slice(2);

  const year = parseInt(yearStr, 10);

  let month;
  switch (quarter) {
    case 'Q1':
      month = 0;
      break;
    case 'Q2':
      month = 3;
      break;
    case 'Q3':
      month = 6;
      break;
    case 'Q4':
      month = 9;
      break;
    default:
      if (!quarter?.startsWith('Q')) {
        throw new Error(`Invalid quarter: ${quarterStr}`);
      }
      const quarterNum = parseInt(quarter.slice(1), 10);
      if (!Number.isInteger(quarterNum) || quarterNum < 1 || quarterNum > 4) {
        throw new Error(`Invalid quarter: ${quarterStr}`);
      }
      month = (quarterNum - 1) * 3;
  }
  return new Date(year, month, 1);
}


