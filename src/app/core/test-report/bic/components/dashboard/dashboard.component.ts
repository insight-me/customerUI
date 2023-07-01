import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';
import { BaseDashboardComponent } from '../../../components/base-dashboard/base-dashboard.component';
import {
  OVERALL_SCORE_LIKEABILITY_TEXT,
  OVERALL_SCORE_LIKEABILITY_TYPE,
  OVERALL_SCORE_UNIQUENESS_TEXT,
  OVERALL_SCORE_UNIQUENESS_TYPE,
  PURCHASE_INTENT_TEXT,
  PURCHASE_INTENT_TYPE,
  UNIQUENESS_TEXT,
  UNIQUENESS_TYPE
} from '../../../../../../assets/consts/graph-tooltip-texts.const';
import { filter } from 'rxjs/operators';
import { BubbleDataSetModel } from 'src/app/shared/models/bic.test.report/bubble.data.set.model';
import { Observable } from 'rxjs';
import { BarDataSetModel } from 'src/app/shared/models/bic.test.report/bar.data.set.model';
import { BicDashboardType } from '../../../../../shared/enums/bic.report.dashboard.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../components/base-dashboard/base-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends BaseDashboardComponent implements OnInit {
  public tooltipType = OVERALL_SCORE_UNIQUENESS_TYPE;
  public tooltipTexts = OVERALL_SCORE_UNIQUENESS_TEXT;
  public tooltipTypeSecond = OVERALL_SCORE_LIKEABILITY_TYPE;
  public tooltipTextsSecond = OVERALL_SCORE_LIKEABILITY_TEXT;
  public tooltipTextsPurchaseIntent = PURCHASE_INTENT_TEXT;
  public tooltipTypePurchaseIntent = PURCHASE_INTENT_TYPE;
  public tooltipTextsUniqueness = UNIQUENESS_TEXT;
  public tooltipTypeUniqueness = UNIQUENESS_TYPE;
  public purchaseIntentUniquenessDataSet$: Observable<BubbleDataSetModel[]> = null;
  public purchaseIntentDataSet$: Observable<BarDataSetModel[]> = null;
  public uniquenessDataSet$: Observable<BarDataSetModel[]> = null;
  public BicDashboardType: typeof BicDashboardType = BicDashboardType;

  constructor(public bicRSS: BicReportStateService) {
    super();
    this.setService(this.bicRSS);
  }

  public ngOnInit(): void {
    this.purchaseIntentUniquenessDataSet$ = this.bicRSS.purchaseIntentUniquenessDataSet$.asObservable().pipe(filter(val => !!val));
    this.purchaseIntentDataSet$ = this.bicRSS.purchaseIntentDataSet$.asObservable().pipe(filter(val => !!val));
    this.uniquenessDataSet$ = this.bicRSS.uniquenessDataSet$.asObservable().pipe(filter(val => !!val));
  }
}
