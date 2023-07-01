import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements AfterViewInit {
  @Input() list: string[] = [];
  @Input() isMulti = false;
  @Input() set menuOpen(isClosed) {
    this._updateValues();
  }
  @Output() filtered: EventEmitter<any> = new EventEmitter();

  public formArray: FormArray = new FormArray([]);

  private _filteredValues: string[] = [];

  public ngAfterViewInit(): void {
    this.list.forEach(() => this.formArray.push(new FormControl(false)));
  }

  public getFormControl(i: number): FormControl {
    return this.formArray.controls[i] as FormControl;
  }

  public filter(): void {
    this.filtered.emit(
      [...this.list].filter((item, i) => this.formArray.controls[i].value)
    );
    this._filteredValues = [...this.list].filter((item, i) => this.formArray.controls[i].value);
  }

  public reset(): void {
    this.formArray.controls.forEach((control) => control.setValue(false));
    this.filtered.emit([]);
    this._filteredValues = [];
  }

  private _updateValues(): void {
    this.list.forEach((item, i) => {
      if (this._filteredValues.includes(item)) {
        this.formArray.controls[i]?.setValue(true);
      } else {
        this.formArray.controls[i]?.setValue(false);
      }
    });
  }
}
