import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-registration-initiation',
  templateUrl: './registration-initiation.component.html',
  styleUrls: [
    './registration-initiation.component.scss',
    '../login/login.component.scss'
  ],
})
export class RegistrationInitiationComponent {
  @Input() infoTextFirst = '';
  @Input() infoTextSecond = '';
}
