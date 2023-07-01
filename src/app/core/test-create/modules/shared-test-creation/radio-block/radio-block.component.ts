import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-radio-block',
  templateUrl: './radio-block.component.html',
  styleUrls: ['./radio-block.component.scss']
})
export class RadioBlockComponent {
  @Input() formControlEl: FormControl;
  @Input() controlName: string;
  @Output() updateRecognition = new EventEmitter();
}
