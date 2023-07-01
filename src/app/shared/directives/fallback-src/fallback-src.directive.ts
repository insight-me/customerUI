import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fallback-src]'
})
export class FallbackSrcWidthDirective implements OnDestroy {
  @Input('fallback-src')
  public imageSrc: string;
  private readonly element: HTMLElement;
  private readonly eventType: string = 'error';

  constructor(el: ElementRef) {
    this.element = el.nativeElement;
    this.element.addEventListener(this.eventType, this.onError.bind(this));
  }

  public ngOnDestroy(): void {
    this.removeEvents();
  }

  private onError(): void {
    this.removeEvents();
    this.setImage(this.imageSrc);
  }

  private setImage(src: string): void {
    this.element.setAttribute('src', src);
  }

  private removeEvents(): void {
    this.element.removeEventListener(this.eventType, this.onError);
  }
}
