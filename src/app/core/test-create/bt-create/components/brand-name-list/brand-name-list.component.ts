import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-brand-name-list',
  templateUrl: './brand-name-list.component.html',
  styleUrls: ['./brand-name-list.component.scss'],
})
export class BrandNameListComponent {
  public nameControl: FormControl = new FormControl({
    value: '',
    disabled: true,
  });

}
