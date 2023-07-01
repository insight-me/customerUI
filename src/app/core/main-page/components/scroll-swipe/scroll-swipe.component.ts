import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-scroll-swipe',
  templateUrl: './scroll-swipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollSwipeComponent {
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  private dragStartX: number = 0;
  private dragEndX: number = 0;

  @Output() public scroll: EventEmitter<boolean> = new EventEmitter<boolean>();

  public wheelHandler(event: WheelEvent): void {
    if (!event.deltaX || Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      return;
    }
    this.scroll.emit(event.deltaX > 0);
  }

  public touchStartHandler(event): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  public touchEndHandler(event): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleGesture();
  }

  private handleGesture(): void {
    if (Math.abs(this.touchEndX - this.touchStartX) < 50) {
      return;
    }
    if (this.touchEndX < this.touchStartX) {
      this.scroll.next(true);
    } else if (this.touchEndX > this.touchStartX) {
      this.scroll.next(false);
    }
  }

  public mouseDown(event: MouseEvent): void {
    this.dragStartX = event.x;
  }

  public mouseUp(event: MouseEvent): void {
    this.dragEndX = event.x;
    this.handleDrag();
  }

  private handleDrag(): void {
    if (Math.abs(this.dragEndX - this.dragStartX) < 50) {
      return;
    }
    if (this.dragEndX < this.dragStartX) {
      this.scroll.next(true);
    } else if (this.dragEndX > this.dragStartX) {
      this.scroll.next(false);
    }
  }
}
