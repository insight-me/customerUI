import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SummaryDatasetModel } from '../../../../../shared/models/bic.test.report/summary.dataset.model';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryTableComponent {
  @Input() public accumulatedLikes: SummaryDatasetModel[];
  @Input() public pdfVersion = false;
  @Input() public likeConfig: { like: boolean; dislike: boolean } = {
    like: true,
    dislike: true,
  };
}
