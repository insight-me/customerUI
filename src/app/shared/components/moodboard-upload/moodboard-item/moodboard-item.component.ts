import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-moodboard-item',
  templateUrl: './moodboard-item.component.html',
  styleUrls: ['./moodboard-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoodboardItemComponent {
  @Input() public container: HTMLElement;
  @Input() public image: any;
  @Input() position: number;
  @Input() public set itemData(data: any) {
    this.dragPosition = {x: data?.itemPositionX || 0, y : data?.itemPositionY || 0};
    this.width = data?.itemWidth || this.width;
    this.height = data?.itemHeight || this.height;
  }
  @Output() public changeImage = new EventEmitter();
  @Output() public selectImage = new EventEmitter();
  @Output() public saveImage = new EventEmitter();
  public dragPosition = {x: 0, y: 0};
  public width = 200;
  public height = 200;

  public get styleForImage(): any {
    return {
      width: this.width + 'px',
      height: this.height + 'px',
      zIndex: this.position
    };
  }

  public getNewPosition(): void {
    this.saveImage.emit();
  }

  public updatePosition(position: {x: number, y: number, width: number, height: number}): void {
    this.dragPosition = {x: position.x || this.dragPosition.x, y: position.y || this.dragPosition.y};
    this.width = position.width || this.width;
    this.height = position.height || this.height;
    this.changeImage.emit({position: this.dragPosition, height: this.height, width: this.width});
  }

  public dragEnded(event: any): void {
    const {x, y} = event.source.getFreeDragPosition();
    this.dragPosition = {x, y};
    this.changeImage.emit({position: this.dragPosition, height: this.height, width: this.width});
  }
}
