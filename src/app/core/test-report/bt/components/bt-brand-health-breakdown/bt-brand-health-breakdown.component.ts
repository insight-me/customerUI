import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { BtStyleService } from '../../bt.style.service';
import { BtReportStateService } from '../../bt.report.state.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-bt-brand-health-breakdown',
  templateUrl: './bt-brand-health-breakdown.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtBrandHealthBreakdownComponent implements OnInit, OnDestroy {
  public isFilterActive: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    public btStyle: BtStyleService,
    public btRSS: BtReportStateService
  ) { }

  public ngOnInit(): void {
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
