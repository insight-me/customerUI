import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[associationScore]',
})
export class AssociationScoreDirective implements AfterViewInit {
  @Input() associationScore: boolean;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const innerText: string = this.el.nativeElement.innerText;
    if (this.associationScore) {
      this.el.nativeElement.innerText = `${innerText}%`;
    } else {
      if (+innerText > 107) {
        this.el.nativeElement.style.color = '#4DAC48';
      }
      if (+innerText < 93) {
        this.el.nativeElement.style.color = '#FF776F';
      }
      this.el.nativeElement.innerText = `ix.${innerText}`;
    }
  }
}
