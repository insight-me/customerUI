import { AfterViewInit, Directive } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import InputMask from 'inputmask';

@Directive({
  selector: '[appDateMask]'
})
export class DateMaskDirective implements AfterViewInit {
  constructor(private primeCalendar: Calendar) { }


  public ngAfterViewInit() {
    new InputMask( this.getDateMask(), { alias: 'datetime', inputFormat: 'dd-mm-yyyy', inputMode: 'numeric', placeholder: 'dd-mm-yyyy'} ).mask( this.getHTMLInput() );
  }

  getHTMLInput(): HTMLInputElement {
    return this.primeCalendar.el.nativeElement.querySelector('input');
  }

  getDateMask(): string {
    if (this.primeCalendar.timeOnly) {
      return '99:99';
    } else if (this.primeCalendar.showTime) {
      return '99-99-9999 99:99';
    } else {
      return '99-99-9999';
    }
  }
}
