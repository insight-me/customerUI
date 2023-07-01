
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { GlobalFilterService } from 'src/app/core/test-report/bt/components/global-filter.service';
import { GlobalFilterObserver } from 'src/app/shared/decorators/global-filter-observer.decorator';
import { BaseDashboardComponent } from '../../../components/base-dashboard/base-dashboard.component';
import { BtReportStateService } from '../../bt.report.state.service';
@UntilDestroy()
@GlobalFilterObserver()
@Component({
  selector: 'app-bt-dashboard',
  templateUrl: './bt-dashboard.component.html',
  styleUrls: ['../../../components/base-dashboard/base-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtDashboardComponent extends BaseDashboardComponent {
  public isOpened = true;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  get penetrationInMonthes(): number {
    return this.btRSS.test.penetrationInMonthes
  }

  constructor(
    public btRSS: BtReportStateService,
    public globalFilterService: GlobalFilterService,
  ) {
    super();
    this.setService(this.btRSS);
  }

}
