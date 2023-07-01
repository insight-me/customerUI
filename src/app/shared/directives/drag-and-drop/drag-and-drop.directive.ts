import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<any>();

  @HostBinding('style.border-color') private borderColor = '#EBEBEB';

  @HostListener('dragover', ['$event']) public onDragOver(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = '#C5D0DE';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = '#EBEBEB';
  }

  @HostListener('drop', ['$event']) public ondrop(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = '#EBEBEB';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

  @HostListener('body:dragover', ['$event']) public onBodyDragOver(
    event: DragEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('body:drop', ['$event']) public onBodyDrop(event: DragEvent): void {
    event.preventDefault();
    this.borderColor = '#EBEBEB';
  }
}
