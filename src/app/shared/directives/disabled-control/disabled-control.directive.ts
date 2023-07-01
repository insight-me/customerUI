import { Directive, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[disabledControl]',
})
export class DisabledControlDirective implements OnInit {
  @Input() set disabledControl(condition: boolean) {
    this.update(condition);
  }

  constructor(private ngControl: NgControl) {}

  ngOnInit() {}

  private update(condition: boolean) {
    requestAnimationFrame(() => {
      const action = condition ? 'disable' : 'enable';
      if (this.ngControl.control) {
        this.ngControl.control[action]();
      } else {
        console.error('No control associated with ngControl');
      }
    });
  }
}
