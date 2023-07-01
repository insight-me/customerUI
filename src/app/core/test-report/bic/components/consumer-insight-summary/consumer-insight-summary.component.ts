import { Component, Input } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { AccumulatedLikes } from '../../../../../shared/models/bic.test.report/test.concept.result.model';
import { SummaryDatasetModel } from '../../../../../shared/models/bic.test.report/summary.dataset.model';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-consumer-insight-summary',
  templateUrl: './consumer-insight-summary.component.html',
  styleUrls: ['../consumer-insight.scss'],
})
export class ConsumerInsightSummaryComponent {
  @Input() public dataSet$: BehaviorSubject<ConsumerInsightModel[]> = null;
  @Input() public likeConfig: { like: boolean; dislike: boolean } = {
    like: true,
    dislike: true,
  };

  constructor() {}

  public getAccumulatedLikes(accumulatedLikes: AccumulatedLikes): SummaryDatasetModel[] {
    return TestReportUtils.summaryDataSet(accumulatedLikes);
  }
}
