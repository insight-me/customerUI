import { BtMultiselectFilter } from '../models/bt.test.report/bt.multiselect.filter.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ListItem } from '../models/test.model';

export class LocalFiltersUtils {
  constructor() {}

  public static createForm(filterModel: BtMultiselectFilter[]): FormGroup {
    const localFilterForm = new FormGroup({});
    filterModel.forEach(formControl => {
      const newControl = new FormControl(null);
      localFilterForm.addControl(formControl.formControlName, newControl);
    });
    return localFilterForm;
  }

  public static getAllKPIsSelected(): Record<string, boolean> {
    return {
      AidedAwareness: true,
      Consideration: true,
      Preference: true,
      Penetration: true,
    };
  }

  public static getAllItemsSelected(segments: ListItem[]): Record<string, boolean> {
    const segmentObj = {};
    segments.forEach(segment => (segmentObj[segment.id] = true));
    return segmentObj;
  }
}
