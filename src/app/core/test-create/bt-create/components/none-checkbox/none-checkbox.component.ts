import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-none-checkbox',
  templateUrl: './none-checkbox.component.html',
  styleUrls: ['../../../../test-create/bt-create/preview/bt-preview-input-brand/bt-preview-input-brand.component.scss']
})
export class NoneCheckboxComponent {
  @Input() needLabel = true;
  @Input() width: boolean;

}
