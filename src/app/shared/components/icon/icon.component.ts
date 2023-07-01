import { Component, Input} from '@angular/core';
import { IconsType } from '../../enums/icons.type';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() public iconType: IconsType;
  @Input() public color: string = '#000000';
  @Input() public width: number = 24;
  @Input() public height: number = 24;

  public IconsType = IconsType;

}
