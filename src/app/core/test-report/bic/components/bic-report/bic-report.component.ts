import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { Test } from '../../../../../shared/models/test.model';
import { BaseReportComponent } from '../../../components/base-report/base-report.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bic-test-report',
  templateUrl: './bic-report.component.html',
  styleUrls: [ '../../../components/base-report/base-report.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ BicReportStateService ],
})
export class BicReportComponent extends BaseReportComponent<Test> implements OnInit {
  constructor(
    public bicRSS: BicReportStateService,
    protected injector: Injector
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.test$ = this.getTest(this.bicRSS) as Observable<Test>;
  }
}
