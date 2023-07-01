import {FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import isEmail from 'validator/es/lib/isEmail';
import isInt from 'validator/es/lib/isInt';

export class CustomValidator {

  public static atLeastOneFromArray(array: FormArray): { [key: string]: boolean } | null {
    if (array.value.map(group => group.isSelected).some(el => el)) {
      return null;
    }
    return {'At Least One From Array Required': true};
  }

  public static ageRangeValidator(formGroup: FormGroup): ValidationErrors {
    const minAgeControl = formGroup.get('minAge');
    const maxAgeControl = formGroup.get('maxAge');
    const {minAge, maxAge} = formGroup.value;
    if (minAge && maxAge && minAge > maxAge) {
      minAgeControl.setErrors({invalidDate: true});
      maxAgeControl.setErrors({invalidDate: true});
      return {invalidDate: true};
    } else {
      minAgeControl.setErrors(null);
      maxAgeControl.setErrors(null);
      return null;
    }
  }

  public static emailValidator(formControl: FormControl): ValidationErrors {
    if (formControl.value && !isEmail(formControl.value)) {
      return {email: true};
    } else {
      return null;
    }
  }


  public static isIntegerValidator(formControl: FormControl): ValidationErrors {
    if (formControl.value && !isInt(formControl.value.toString())) {
      return {notInteger: true};
    } else {
      return null;
    }
  }
}
