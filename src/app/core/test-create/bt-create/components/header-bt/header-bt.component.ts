import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';

@Component({
  selector: 'app-header-bt',
  templateUrl: './header-bt.component.html',
  styleUrls: ['./header-bt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBtComponent {
  @Input() testName = '';

  public get IconsType(): typeof IconsType {
    return IconsType;
  }
}
