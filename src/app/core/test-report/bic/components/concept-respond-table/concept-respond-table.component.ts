import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ConceptBenefitsReasonsModel } from '../../../../../shared/models/bic.test.report/concept.benefits.reasons.model';
import { ConceptReportTableDataType } from '../../../../../shared/enums/concept.report.table.data.type';
import { AccumulatedBenefits, AccumulatedReasons } from '../../../../../shared/models/bic.test.report/test.concept.result.model';

@Component({
  selector: 'app-concept-respond-table',
  templateUrl: './concept-respond-table.component.html',
  styleUrls: [ './concept-respond-table.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConceptRespondTableComponent implements OnInit {
  @Input() public dataSet: ConceptBenefitsReasonsModel;
  @Input() public type: ConceptReportTableDataType;

  public columnTitle: string;
  public average: number;
  public ConceptReportTableDataType = ConceptReportTableDataType;

  constructor() {
  }

  public ngOnInit(): void {
    this.dataSet.accumulatedData.sort((a, b) => b.originalPercent - a.originalPercent);
    this.average = this.getAverage();

    switch (this.type) {
      case ConceptReportTableDataType.Reasons:
        this.columnTitle = 'report.reason';
        break;
      case ConceptReportTableDataType.Benefits:
        this.columnTitle = 'report.benefit';
        break;
      case ConceptReportTableDataType.Relevance:
        this.columnTitle = 'report.concept';
    }
  }

  private getAverage(): number {
    if (!this.dataSet.accumulatedData.length) {
      return null;
    }
    const elements = this.dataSet.accumulatedData.map(({ originalPercent }) => originalPercent);
    const min = Math.min(...elements);
    const max = Math.max(...elements);
    return Math.round((min + max) / 2);
  }

  public getStyle(item: AccumulatedBenefits | AccumulatedReasons, isNameColumn: boolean): { [key: string]: string } {
    return {
      background: this.getBackground(item.originalPercent, isNameColumn)
    };
  }

  private getBackground(value: number, isNameColumn: boolean): string {
    const isHigher = value >= this.average;
    switch (this.type) {
      case ConceptReportTableDataType.Benefits:
        return isNameColumn ? '#f7f7fc' : isHigher ? '#B8B2EA' : '#E6E2F8';
      case ConceptReportTableDataType.Reasons:
        return isNameColumn ? '#fff6f0' : isHigher ? '#FFA56F' : '#FFCBAD';
      case ConceptReportTableDataType.Relevance:
        return isNameColumn ? '#F6F5FC' : '#E6E2F8';
    }
  }
}
