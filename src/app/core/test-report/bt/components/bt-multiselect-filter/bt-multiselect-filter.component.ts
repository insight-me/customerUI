import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BtStyleService } from '../../bt.style.service';
import { ListItem } from '../../../../../shared/models/test.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-bt-multiselect-filter',
  templateUrl: './bt-multiselect-filter.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtMultiselectFilterComponent {

  @Input() public options: ListItem[];
  @Input() public control: FormControl;

  @Input() public infoLabel: string = 'report.Select brand';
  @Input() public valuesLabel: string = 'report.Brands';
  @Input() public allLabel: string = 'report.All Brands';

  public isFilterActive: boolean = false;
  public selected: {[key: string]: boolean} = {};
  public all: boolean = false;

  constructor(
    public btStyle: BtStyleService,
  ) { }

  public setInitialSelection(): void {
    const currentSelection = this.control.value;
    this.options.forEach(option => this.selected[option.id] = currentSelection.includes(option.id));
    this.all = Object.keys(this.selected).every(id => !!this.selected[id]);
  }

  public apply(): void {
    const value = Object.keys(this.selected).filter(id => this.selected[id]);
    if (!value.length) {
      return;
    }
    this.control.setValue(value);
  }

  public toggle(value: string): void {
    if (value === 'all') {
      Object.keys(this.selected).forEach(id => this.selected[id] = this.all);
    }
    this.all = Object.keys(this.selected).every(id => !!this.selected[id]);
  }

}
