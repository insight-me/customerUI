import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BtReportStateService } from '../../bt.report.state.service';

@Component({
  selector: 'app-bt-net-promoter-score',
  templateUrl: './bt-net-promoter-score.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtNetPromoterScoreComponent {
  constructor(public btSS: BtReportStateService) {}
}
