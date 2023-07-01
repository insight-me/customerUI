import { BTTest } from '../models/bt-test.model';
import { Test } from '../models/test.model';

export function getBTTestTime(test: BTTest): number {
  let timeForAnswering = 0;

  // TIME MOCK
  if (test.brands.length <= 10) {
    timeForAnswering = 600;
  }
  if (test.brands.length && test.brands.length > 10) {
    timeForAnswering = 900;
  }
  return timeForAnswering;
}

export function getBICTestTime(test: Test): number {
  let timeForAnswering = 0;

  // TIME MOCK
  if (test.concepts.length && test.concepts.length <= 4) {
    timeForAnswering = 600;
  }
  if (test.concepts.length && test.concepts.length > 4 && test.concepts.length <= 7) {
    timeForAnswering = 900;
  }
  if (test.concepts.length && test.concepts.length > 7) {
    timeForAnswering = 1200;
  }
  return timeForAnswering;
}

// function getQuortas(startDate: string | Date, testDuration: number): number {
//   const startDateInDate = new Date(Date.parse(startDate as string));
//   const firstQuorta = getQuarter(startDateInDate);
//   const monthToAdd = startDateInDate.getMonth() + +testDuration;
//   const nextDate = new Date(startDateInDate.setMonth(monthToAdd));
//   const secondQuarta = getQuarter(nextDate);
//   return secondQuarta - firstQuorta + 1;
// }

// function getQuarter(date: Date): number {
//   const year = date.getFullYear() * 4;
//   const month = date.getMonth() + 1;
//   return Math.ceil(year + month / 3);
// }
