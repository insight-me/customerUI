import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GlobalFilterService } from 'src/app/core/test-report/bt/components/global-filter.service';
import { GlobalFilterObserver } from 'src/app/shared/decorators/global-filter-observer.decorator';
import { BtStyleService } from '../../bt.style.service';


@UntilDestroy()
@GlobalFilterObserver()
@Component({
  selector: 'app-bt-brand-funnel-footer',
  templateUrl: './bt-brand-funnel-footer.component.html',
  styleUrls: ['./bt-brand-funnel-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtBrandFunnelFooterComponent implements OnInit {
  @Input() public pdfVersion = false;
  @Input() public average: { [key: string]: number };
  // ! Using in decorator
  public isOpened = true;

  constructor(
    public btStyle: BtStyleService,
    // ! Using in decorator
    private globalFilterService: GlobalFilterService,
    private cdRef: ChangeDetectorRef
  ) { }


  // ! Using in decorator
  ngOnInit(): void { }

  public greenLabel(field: string): string {
    const average = this.average[field];
    return average === 0 ? `-` : `> ${average > 90 ? 100 : average + 10}%`;
  }

  public yellowLabel(field: string): string {
    const average = this.average[field];
    return average === 0 ? `-` : average < 10 ? `> ${average < 10 ? 0 : average - 10}-${average > 90 ? 100 : average + 10}%` : `${average < 10 ? 0 : average - 10}-${average > 90 ? 100 : average + 10}%`;
  }

  public orangeLabel(field: string): string {
    const average = this.average[field];
    return average === 0 || average < 10 ? `0%` : `< ${average < 10 ? 0 : average - 10}%`;
  }
}
