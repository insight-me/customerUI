import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KPITitle } from 'src/app/shared/models/bic.test.report/KPIModel';
import { BicReportStateService } from '../../bic.report.state.service';
import { Observable } from 'rxjs';
import {
  PURCHASE_FREQUENCY_TEXT,
  PURCHASE_FREQUENCY_TYPE,
  SCORE_PER_SEGMENT_TEXT,
  SCORE_PER_SEGMENT_TYPE
} from '../../../../../../assets/consts/graph-tooltip-texts.const';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-brand-and-business-kpis',
  templateUrl: './brand-and-business-kpis.component.html',
  styleUrls: [
    '../concept-definitions/concept-definitions.component.scss',
    '../../../components/custom-question-preview/custom-question-preview.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandAndBusinessKpisComponent implements OnInit {
  public KPITitle = KPITitle;
  public purchaseFrequenciesData;
  public purchaseFrequenciesChart = [];
  public tooltipType = SCORE_PER_SEGMENT_TYPE;
  public tooltipTexts: string[] = [];
  public tooltipTypePF = PURCHASE_FREQUENCY_TYPE;
  public tooltipTextsPF: string[] = PURCHASE_FREQUENCY_TEXT;

  public purchaseFrequenciesDataSet$: Observable<BarDataSetModel[]> = null;

  constructor(public bicRSS: BicReportStateService) {}

  public ngOnInit(): void {
    this.setTextForTooltips();
    this.purchaseFrequenciesDataSet$ = this.bicRSS.purchaseFrequenciesDataSet$.asObservable().pipe(
      filter(item => !!item),
      tap(value => {
        this.purchaseFrequenciesChart = value[0]?.gridData.map(item => {
          return {
            value: item.label,
            index: item.index,
          };
        });
      })
    );
  }

  public setTextForTooltips(): void {
    this.tooltipTexts = [...SCORE_PER_SEGMENT_TEXT];
    const KPIsArr = this.bicRSS.test.testKPIs.map(item => item.title);
    if (KPIsArr.length > this.tooltipTexts.length) {
      if (KPIsArr.includes(KPITitle.CurrentBrandLikeability)) {
        this.tooltipTexts.splice(2, 0, 'report.Would this idea make you like the current brand more or less?');
      }
      if (KPIsArr.includes(KPITitle.Brandfit)) {
        this.tooltipTexts.push('report.How well do you think the idea matches the brand?');
      }
    }
  }
}
