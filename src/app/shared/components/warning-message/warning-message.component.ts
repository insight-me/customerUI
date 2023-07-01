import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';

@Component({
  selector: 'app-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningMessageComponent {
  @Input() public text = '';
  @Input() public color = '#000';
  @Input() public backgroundColor = 'rgba(255, 119, 111, 0.15)';
  @Input() public isCentered = false;
  @Input() public margin = '0';

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get textStyle(): Record<string, string> {
    return {
      justifyContent: this.isCentered ? 'center' : 'flex-start',
      color: this.color,
      backgroundColor: this.backgroundColor,
      margin: this.margin
    };
  }
}
