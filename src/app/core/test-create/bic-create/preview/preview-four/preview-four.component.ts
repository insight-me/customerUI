import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-four',
  templateUrl: './preview-four.component.html',
  styleUrls: ['./preview-four.component.scss'],
})
export class PreviewFourComponent {
  @Input() test: any = null;
  @Input() concept: any;

  constructor() { }
}
