import { ChangeDetectionStrategy, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BTTest } from "../../../../../shared/models/bt-test.model";
import { ListItem } from '../../../../../shared/models/test.model';
import { BaseReportComponent } from "../../../components/base-report/base-report.component";
import { BtReportStateService } from "../../bt.report.state.service";
import { BtStyleService } from "../../bt.style.service";
import { GlobalFilterService } from '../global-filter.service';

@Component({
  selector: 'app-bt-report',
  templateUrl: './bt-report.component.html',
  styleUrls: ['./bt-report.component.scss', '../../../components/base-report/base-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BtReportStateService, BtStyleService]
})
export class BtReportComponent extends BaseReportComponent<BTTest> implements OnInit, OnDestroy {
  public isOpened = true;
  private sub: Subscription = new Subscription();

  constructor(
    public btRSS: BtReportStateService,
    private globalFilterService: GlobalFilterService,
    protected injector: Injector
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.test$ = this.getTest(this.btRSS) as Observable<BTTest>;

    this.sub.add(
      this.btRSS.brand.valueChanges
        .pipe(
          tap((id: string) => {
            this.btRSS.currentBrand.next(
              this.btRSS.ownBrands.getValue().find((item: ListItem) => item.id === id).value
            );
          })
        )
        .subscribe()
    );
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
