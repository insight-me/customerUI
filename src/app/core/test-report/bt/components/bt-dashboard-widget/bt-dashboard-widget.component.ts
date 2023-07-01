import { AfterViewInit, Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InlineStyleModel } from '../../../../../shared/models/inline.style.model';
import { BtStyleService } from '../../bt.style.service';
import { BtReportStateService } from '../../bt.report.state.service';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';

@Component({
  selector: 'app-bt-dashboard-widget',
  template: '',
})
export class BtDashboardWidgetComponent<T> extends BaseLocalFiltersComponent<T> implements AfterViewInit, OnChanges {

  public switcher: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public style: {[key: string]: InlineStyleModel} = {
    footer: {
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    legend: {
      'font-size': '14px',
      'letter-spacing': '0',
      margin: '0 30px 10px 0',
      display: 'flex',
      'align-items': 'center',
      'font-family': 'GT Walsheim Pro Medium',
      'line-height': '150%',
    },
    icon: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      marginRight: '11px',
    }
  }

  public btStyle: BtStyleService;
  public btRSS: BtReportStateService;

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
    this.btStyle = injector.get(BtStyleService);
    this.btRSS = injector.get(BtReportStateService);
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && changes.dataSet.currentValue) {
      this.refreshChart();
    }
  }

  public getBackground(index: number): string {
    return TestReportUtils.getLineChartColor(index);
  }

  public refreshChart(): void {
    this.switcher.next(false);
    setTimeout(() => this.switcher.next(true));
  }

}
