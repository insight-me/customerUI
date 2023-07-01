import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRerenderChart]',
})
export class RerenderChartDirective {
  private isResizing = false;

  @HostBinding('style.display')
  public get displayStyle(): string {
    return this.isResizing ? 'none' : '';
  }

  @HostBinding('ngIf')
  get ngIf(): boolean {
    return !this.isResizing;
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.isResizing = true;
    setTimeout(() => {
      this.isResizing = false;
    });
  }
}
