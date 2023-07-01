import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListItem } from '../../models/test.model';

@Component({
  selector: 'app-base-form-element',
  template: '',
})
export class BaseFormElementComponent {
  @Input() public formGroup: FormGroup;
  @Input() public controlName: string;
  @Input() public label: string;
  @Input() public errorMassage: string;
  @Input() public options: ListItem[];

  public id: string = Math.random().toString();

  @Output() public valueChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

}
