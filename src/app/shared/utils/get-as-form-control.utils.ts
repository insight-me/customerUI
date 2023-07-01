import { AbstractControl, FormControl } from '@angular/forms';

export function getAsFormControl(control: AbstractControl): FormControl {
  return control as FormControl;
}
