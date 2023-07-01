import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { UI_DATE_TIME_FORMAT, UI_DATE_FORMAT } from 'src/assets/consts/consts';

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string, type?: string): string {
        if (type === 'time') {
            return moment(value).format(UI_DATE_TIME_FORMAT);
        } else {
            return moment(value).format(UI_DATE_FORMAT);
        }
    }
}
