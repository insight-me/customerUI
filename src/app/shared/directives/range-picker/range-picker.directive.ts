import { AfterViewInit, Directive, ElementRef, Input, QueryList, Renderer2 } from '@angular/core';


export enum QuarterClasses {
  SELECTED_ITEM = 'selected-quarter',
  DISABLED = 'disabled',
  RANGE_QUARTER = 'range-quarter',
  HOVER = 'hover-quarter'
}

export interface IQuarterValue {
  containerId: number;
  value: string;
}
@Directive({
  selector: '[appRangePicker]'
})
export class RangePickerDirective implements AfterViewInit {
  @Input() public quarterItems: QueryList<ElementRef>;
  @Input() public selectedItem: string;

  constructor(private _elRef: ElementRef, private _renderer2: Renderer2) { }

  public ngAfterViewInit(): void {

    setTimeout(() => {
      this.quarterItems.forEach((item) => {
        if (item.nativeElement.id === this.selectedItem) {
          this._renderer2.addClass(item.nativeElement, 'selected-quarter')
        }
      })
    }, 0);

  }


}
