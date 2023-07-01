import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-concepts-filter',
  templateUrl: './concepts-filter.component.html',
  styleUrls: ['./concepts-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConceptsFilterComponent {

  constructor(
    public bicRSS: BicReportStateService
  ) { }

  public isSelectedControl(formGroup: AbstractControl): FormControl {
    return formGroup.get('isSelected') as FormControl;
  }

  public label(formGroup: AbstractControl): string {
    return formGroup.get('conceptName').value;
  }

  public onChange(): void {
    this.bicRSS.filterSource.next();
  }

}
