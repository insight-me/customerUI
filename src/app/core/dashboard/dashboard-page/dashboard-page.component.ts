import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { TestService } from 'src/app/shared/services/test/test.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentStatusService } from '../../../shared/services/payment-status/payment-status.service';
import { QuickTest } from '../../../shared/models/test.model';
import { FULL_PERCENTS } from '../../../../assets/consts/consts';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  public tests$: Observable<QuickTest[]> = null;

  constructor(
    public appSS: AppStateService,
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private paymentStatusService: PaymentStatusService
  ) {}

  public ngOnInit(): void {
    this.tests$ = this.testService.getQuickTests().pipe(
      map(tests => {
        return tests.map(test => {
          return { ...test, passesPercent: test.passesPercent > FULL_PERCENTS ? FULL_PERCENTS : test.passesPercent };
        });
      })
    );
    if (this.activatedRoute.snapshot.queryParams?.success) {
      this.paymentStatusService.changeState(this.activatedRoute.snapshot.queryParams?.success);
      this.paymentStatusService.changeCardPayment(this.activatedRoute.snapshot.queryParams?.card);
      sessionStorage.removeItem('cardPayment');
    }
  }
}
