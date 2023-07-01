import { FormGroup } from '@angular/forms';
import { MIN_AGE_SPAN } from '../../../assets/consts/test-creation.const';

export function compareNumbers(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.compareNumbers || control.invalid) {
      return;
    }
    if (control.value > matchingControl.value || control.value === matchingControl.value) {
      matchingControl.setErrors({ compareNumbers: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
