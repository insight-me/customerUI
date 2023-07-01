import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { SwiperComponent } from 'ngx-swiper-wrapper';

@Directive({
  selector: '[appDisableSwiper]'
})
export class DisableSwiperDirective implements OnInit {
  private _disableClass = 'no-swipe';
  @Input() public swiperComponent: SwiperComponent;

  constructor(private _elRef: ElementRef, private _renderer2: Renderer2) { }

  public ngOnInit(): void {
    this._renderer2.addClass(this._elRef.nativeElement, this._disableClass);
    this.swiperComponent.config.noSwipingClass = this._disableClass;
  }
};