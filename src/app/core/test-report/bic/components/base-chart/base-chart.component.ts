import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';

@Component({
  selector: 'app-base-chart',
  template: '',
})
export class BaseChartComponent<T> implements AfterViewInit {
  protected renderer: Renderer2;
  protected cdr: ChangeDetectorRef;
  @Input() public dataSet: T[];
  @Input() public aspectRatio = 0.6826; /*from design*/
  @Input() public isExpanded = false;

  @Input() public pdfVersion = false;
  @ViewChild('chartRef') public chartRef: ElementRef;
  @Output() public zoom: EventEmitter<void> = new EventEmitter<void>();

  public IconsType = IconsType;
  public total = 0;
  public currentPage = 1;
  public entriesPerPage = 10;

  constructor(protected injector: Injector) {
    this.renderer = injector.get(Renderer2);
    this.cdr = injector.get(ChangeDetectorRef);
  }

  public ngAfterViewInit(): void {
    this.updateChartHeight();
  }

  public updateChartHeight(): void {
    if (this.chartRef) {
      const { clientWidth } = this.chartRef.nativeElement;
      const height = this.aspectRatio * clientWidth;
      this.renderer.setStyle(this.chartRef.nativeElement, 'height', height + 'px');
      setTimeout(() => this.cdr.detectChanges());
    }
  }

  public toggleZoom(index?: number): void {
    this.zoom.emit();
    setTimeout(() => this.updateChartHeight());
  }
}
