import { Component, Input } from '@angular/core';
import { BaseFormElementComponent } from '../base-form-element.component';
import { InlineStyleModel } from '../../../models/inline.style.model';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent extends BaseFormElementComponent {
  @Input() public customStyle: boolean = false;
  @Input() public withTooltip = false;

  constructor() {
    super();
  }
}
