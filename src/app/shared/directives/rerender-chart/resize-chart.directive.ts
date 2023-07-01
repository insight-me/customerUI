import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { GlobalFilterService } from 'src/app/core/test-report/bt/components/global-filter.service';

@Directive({
  selector: '[appResizeChart]',
})
export class ResizeChartDirective implements OnInit, OnDestroy {
  private resizeObserver: ResizeObserver;

  constructor(private elementRef: ElementRef, private _globalFilterService: GlobalFilterService) { }

  public ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this._globalFilterService.switch$.next(true);
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
