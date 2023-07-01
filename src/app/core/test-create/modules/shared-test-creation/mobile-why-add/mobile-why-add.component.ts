import { Component, Input } from '@angular/core';
import { IconsType } from '../../../../../shared/enums/icons.type';

@Component({
  selector: 'app-mobile-why-add',
  templateUrl: './mobile-why-add.component.html',
  styleUrls: ['./mobile-why-add.component.scss']
})
export class MobileWhyAddComponent {
  @Input() title = '';
  @Input() text = [''];
  @Input() isHTML = false;
  public showText = false;

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public toggleShowText(): void {
    this.showText = !this.showText;
  }
}
