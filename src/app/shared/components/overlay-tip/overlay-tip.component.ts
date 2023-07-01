import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IconsType } from '../../enums/icons.type';

@Component({
  selector: 'app-overlay-tip',
  templateUrl: './overlay-tip.component.html',
  styleUrls: ['./overlay-tip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayTipComponent implements OnInit {
  @Input() public title = '';
  @Input() public content = '';

  public isOpen = false;

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  constructor() {}

  ngOnInit(): void {}

  public toggleOverlay(): void {
    this.isOpen = !this.isOpen;
  }

  public close(): void {
    this.isOpen = false;
  }
}
