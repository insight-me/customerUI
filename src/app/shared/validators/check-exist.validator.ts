import { AbstractControl, ValidatorFn } from '@angular/forms';
import { includes } from 'lodash';

export function checkExist(data: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const newData = data.map((item) => item?.trim().toLowerCase());
    if (includes(newData, control?.value?.trim().toLowerCase()) && control.value) {
      return { checkExist: true };
    }
    return null;
  };
}
