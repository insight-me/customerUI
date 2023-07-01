import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BtReportStateService } from '../../bt.report.state.service';

@Component({
  selector: 'app-bt-ad-awareness',
  templateUrl: './bt-ad-awareness.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtAdAwarenessComponent {
  constructor(public btRSS: BtReportStateService) {
  }
}
