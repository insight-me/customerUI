import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BtReportStateService } from '../../bt.report.state.service';
import { BtStyleService } from '../../bt.style.service';

@Component({
  selector: 'app-bt-brand-health-compared-to-competitors',
  templateUrl: './bt-brand-health-compared-to-competitors.component.html',
  styleUrls: ['./bt-brand-health-compared-to-competitors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtBrandHealthComparedToCompetitorsComponent {

  constructor(
    public btRSS: BtReportStateService,
    public btStyle: BtStyleService,
  ) {
  }

}
