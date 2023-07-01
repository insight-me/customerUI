import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import {
  ASSOCIATIONS_SCORE_PER_CONCEPT_TEXT,
  ASSOCIATIONS_SCORE_PER_CONCEPT_TYPE,
} from '../../../../../../assets/consts/graph-tooltip-texts.const';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: [
    './associations.component.scss',
    '../concept-definitions/concept-definitions.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationsComponent {
  public tooltipTexts: string[] = ASSOCIATIONS_SCORE_PER_CONCEPT_TEXT;
  public tooltipType = ASSOCIATIONS_SCORE_PER_CONCEPT_TYPE;

  constructor(public bicRSS: BicReportStateService) {
  }

  public getBackground(index: number, secondColorsSet: boolean): string {
    return TestReportUtils.getColor(index, secondColorsSet);
  }

  public isShowChart(data: GroupedBarDataSet[]): number {
    return data.reduce((a, next) => a + next.values.length, 0);
  }
}
