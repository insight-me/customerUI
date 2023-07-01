import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';

@Component({
  selector: 'app-why-add-mobile',
  templateUrl: './why-add-mobile.component.html',
  styleUrls: ['./why-add-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyAddMobileComponent {
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
