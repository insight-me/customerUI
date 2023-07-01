import { Component, Input } from '@angular/core';
import { IconsType } from '../../enums/icons.type';

const DEFAULT_ARROW_SHIFT = 41;

@Component({
  selector: 'app-question-tooltip',
  templateUrl: './question-tooltip.component.html',
  styleUrls: ['./question-tooltip.component.scss'],
})
export class QuestionTooltipComponent {
  @Input() public texts: string[] = [];
  @Input() public customText = '';
  @Input() public type: string;
  @Input() public title: string;
  @Input() public arrowShift = DEFAULT_ARROW_SHIFT;
  @Input() public additionalClass: string = null;
  @Input() public isCustomContent = false;

  public get IconsType(): typeof IconsType {
    return IconsType;
  }
}
