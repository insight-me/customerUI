import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expand-button',
  templateUrl: './expand-button.component.html',
  styleUrls: ['./expand-button.component.scss']
})
export class ExpandButtonComponent {
  @Input() public active: boolean = false;
}
