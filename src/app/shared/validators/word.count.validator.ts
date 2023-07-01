import { AbstractControl, ValidatorFn } from '@angular/forms';

export function wordCountValidator(minWords: number, maxWords: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (invalidWordsNumber(minWords, maxWords, control.value)) {
      return { wordCount: true };
    }

    return null;
  };
}

export function invalidWordsNumber(minWords: number, maxWords: number, text: string): boolean {
  const value = text || '';
  const wordCount = value.length
    ? value
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word !== '').length
    : 0;
  return wordCount < minWords || wordCount > maxWords;
}
