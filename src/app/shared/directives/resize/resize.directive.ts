import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appResize]',
})
export class ResizableDirective implements OnInit, OnDestroy {
  @Input()
  public resize = true;
  @Input()
  private container: HTMLElement;
  @Output()
  private updatePosition = new EventEmitter();
  @Output()
  private getNewPosition = new EventEmitter();
  private nodes: HTMLElement[] = [];
  private limit = 50;

  private data: { x: number; y: number; rect: ClientRect; direction: string };

  @HostListener('mousedown', ['$event'])
  public mousedown(e): void {
    if (e.target.classList.contains('border') && this.resize) {
      const rect = this.element.nativeElement.getBoundingClientRect();
      this.data = {
        x: e.clientX,
        y: e.clientY,
        rect,
        direction: e.target.className.match(/border-([^ ]+)/)[1],
      };
      e.preventDefault();
    } else {
      this.getNewPosition.emit();
      delete this.data;
    }
  }

  constructor(@Inject(ElementRef) private element: ElementRef) {
    this.mousemove = this.mousemove.bind(this);
    this.mouseup = this.mouseup.bind(this);
  }

  public ngOnInit(): void {
    ['top', 'left', 'right', 'bottom'].forEach(this.createNode.bind(this));
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(
      this.createNode.bind(this)
    );
    window.addEventListener('mousemove', this.mousemove);
    this.element.nativeElement.classList.add('resize');
    window.addEventListener('mouseup', this.mouseup);
  }

  public ngOnDestroy(): void {
    this.nodes.forEach((n) => n.remove());
    window.removeEventListener('mousemove', this.mousemove);
    window.removeEventListener('mouseup', this.mouseup);
  }

  public mousemove(e: MouseEvent): void {
    // e.preventDefault();
    // e.stopPropagation();
    if (this.data) {
      const { height, width, top, left } = this.data.rect;
      const containerLeft = this.container?.getBoundingClientRect().left;
      const containerWidth = this.container?.getBoundingClientRect().width;
      const containerHeight = this.container?.getBoundingClientRect().height;
      const containerTop = this.container?.getBoundingClientRect().top;
      const style = this.element.nativeElement.style;
      // tslint:disable-next-line:variable-name
      const offset_y = this.data.y - e.clientY;
      // tslint:disable-next-line:variable-name
      const offset_x = this.data.x - e.clientX;
      const set: { [key: string]: number } = {};
      switch (this.data.direction) {
        case 'top':
          set.height = height + offset_y - 1;
          set.top = top - offset_y - containerTop;
          break;
        case 'bottom':
          set.height = height - offset_y;
          break;
        case 'left':
          set.width = width + offset_x;
          set.left = left - offset_x - containerLeft;
          break;
        case 'right':
          set.width = width - offset_x;
          break;
        case 'top-left':
          set.height = height + offset_y - 1;
          set.top = top - offset_y - containerTop;
          set.width = width + offset_x;
          set.left = left - offset_x - containerLeft;
          break;
        case 'top-right':
          set.height = height + offset_y - 1;
          set.top = top - offset_y - containerTop;
          set.width = width - offset_x;
          break;
        case 'bottom-left':
          set.height = height - offset_y;
          set.width = width + offset_x;
          set.left = left - offset_x - containerLeft;
          break;
        case 'bottom-right':
          set.height = height - offset_y;
          set.width = width - offset_x;
          break;
      }
      if (set.width < this.limit || set.left < -1) {
        delete set.width;
        delete set.left;
      }
      if (set.height < this.limit || set.top < -1) {
        delete set.height;
        delete set.top;
      }
      if (
        set.width + (set.left || this.data.rect.left) >
        containerWidth + containerLeft
      ) {
        delete set.width;
      }
      if (
        set.height + (set.top || this.data.rect.top) >
        containerHeight + (set.top ? 0 : containerTop)
      ) {
        delete set.height;
      }
      Object.entries(set).forEach(([name, value]) => {
        if (name !== 'top' && name !== 'left') {
          style[name] = value + 'px';
        }
      });
      this.updatePosition.emit({
        x: set.left,
        y: set.top,
        width: set.width,
        height: set.height,
      });
    }
  }
  public createNode(side): void {
    const node = document.createElement('div');
    node.classList.add('border-' + side, 'border');
    this.element.nativeElement.appendChild(node);
    this.nodes.push(node);
  }

  public mouseup(e: MouseEvent): void {
    // e.preventDefault();
    // e.stopPropagation();
    delete this.data;
  }
}
