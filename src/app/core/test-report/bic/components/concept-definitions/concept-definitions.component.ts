import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { ConsumerInsightsTapType } from '../../../../../shared/enums/consumer.insights.tap.type';
import { ConceptReportTableDataType } from '../../../../../shared/enums/concept.report.table.data.type';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { ConceptBenefitsReasonsModel } from '../../../../../shared/models/bic.test.report/concept.benefits.reasons.model';
import {
  BENEFITS_TEXT,
  BENEFITS_TYPE,
  CONSUMER_INSIGHT_TEXT,
  CONSUMER_INSIGHT_TYPE,
  REASONS_TEXT,
  REASONS_TYPE,
  TOTAL_RELEVANCE_TEXT,
  TOTAL_RELEVANCE_TYPE,
} from '../../../../../../assets/consts/graph-tooltip-texts.const';
import { TotalRelevanceModel } from 'src/app/shared/models/bic.test.report/total.relevance.model';
import { TotalRelevanceType } from '../../../../../shared/enums/bic.report.relevance.type';

@Component({
  selector: 'app-concept-definitions',
  templateUrl: './concept-definitions.component.html',
  styleUrls: [ './concept-definitions.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptDefinitionsComponent {
  public ConsumerInsightsTapType = ConsumerInsightsTapType;
  public ConceptReportTableDataType = ConceptReportTableDataType;
  public IconsType = IconsType;
  public totalRelevanceType = TOTAL_RELEVANCE_TYPE;
  public tooltipTextsConsumerInsight: string[] = CONSUMER_INSIGHT_TEXT;
  public tooltipTypeConsumerInsight = CONSUMER_INSIGHT_TYPE;
  public tooltipTextsBenefits: string[] = BENEFITS_TEXT;
  public tooltipTypeBenefits = BENEFITS_TYPE;
  public tooltipTextsReasons: string[] = REASONS_TEXT;
  public tooltipTypeReasons = REASONS_TYPE;

  private _dataSetLength = 0;

  constructor(public bicRSS: BicReportStateService) {
  }

  public checkRelevanceDataSet(dataLength: number): boolean {
    if ( !this._dataSetLength ) {
      this._dataSetLength = dataLength;
    }
    if ( this._dataSetLength !== dataLength ) {
      this._dataSetLength = dataLength;
    }
    return !!dataLength;
  }

  public checkDataSets(dataSets: ConceptBenefitsReasonsModel[]): boolean {
    let hasDataToShow = false;
    dataSets.forEach((model: ConceptBenefitsReasonsModel) => {
      if ( model.accumulatedData.length ) {
        hasDataToShow = true;
      }
    });
    return hasDataToShow;
  }

  public checkDataSet(dataSet: ConceptBenefitsReasonsModel): boolean {
    return this.checkDataSets([ dataSet ]);
  }
}
