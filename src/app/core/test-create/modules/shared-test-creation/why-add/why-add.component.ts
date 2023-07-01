import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-why-add',
  templateUrl: './why-add.component.html',
  styleUrls: ['./why-add.component.scss'],
})
export class WhyAddComponent {
  @Input() title = '';
  @Input() text = [''];
}
