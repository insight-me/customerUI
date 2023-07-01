import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ASSOCIATIONS_SCORE_TEXT, ASSOCIATIONS_SCORE_TYPE } from '../../../../../../assets/consts/graph-tooltip-texts.const';

@Component({
  selector: 'app-associations-score',
  templateUrl: './associations-score.component.html',
  styleUrls: ['./associations-score.component.scss', '../kpi-score-per-concept/kpi-score-per-concept.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationsScoreComponent {
  @Input() public isPrecent: boolean;
  @Input() public title: string;
  @Input() public data = null;

  public tooltipType = ASSOCIATIONS_SCORE_TYPE;
  public tooltipTexts: string[] = ASSOCIATIONS_SCORE_TEXT;

  constructor() {}
}
