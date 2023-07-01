import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutBySlash',
})
export class CutBySlashPipe implements PipeTransform {
  transform(value: string, lengthNum: number): string {
    const wordsArray = value.split(' ');
    const longWordsWithSlashInd = [];
    wordsArray.forEach((word, i) => {
      if (word.length > lengthNum && word.includes('/')) {
        longWordsWithSlashInd.push(i);
      }
    });
    longWordsWithSlashInd.forEach(
      (ind) => (wordsArray[ind] = wordsArray[ind].split('/').join('/ '))
    );
    return wordsArray.join(' ');
  }
}
