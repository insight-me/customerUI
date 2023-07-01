import { Component, HostListener, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { penetrationTitle } from 'src/app/shared/helpers/penetration-title';
import { BrandFunnelDatasetModelItem } from '../../../../../shared/models/bt.test.report/brand.funnel.dataset.model';
import { BtReportStateService } from '../../bt.report.state.service';
import { BtStyleService } from '../../bt.style.service';

@Component({
  selector: 'app-bt-brand-funnel-table',
  templateUrl: './bt-brand-funnel-table.component.html',

})
export class BtBrandFunnelTableComponent {
  @Input() public dataSet: BrandFunnelDatasetModelItem[];
  @Input() public pdfVersion = false;
  @Input() public average: { [key: string]: number };
  public penetrationTitle = penetrationTitle;
  innerWidth = window.innerWidth
  get penetrationInMonthes(): number {
    return this._btRSS.test.penetrationInMonthes;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateInnerWidth();
  }

  updateInnerWidth() {
    this.innerWidth = window.innerWidth;
  }



  constructor(public btStyle: BtStyleService,
    private _btRSS: BtReportStateService,
    public ts: TranslateService
  ) { }

  public getColorByValue(value: number, field: string): string {
    const average = this.average[field];
    const edgeMax = average > 90 ? 100 : this.average[field] + 10;
    const edgeMin = average < 10 ? 0 : this.average[field] - 10;
    if (average === 0 || (average < 10 && value === 0)) {
      return '#FFA56F';
    }
    if (value > edgeMax) {
      return '#AFEBAB';
    } else if (value < edgeMin) {
      return '#FFA56F';
    } else {
      return '#F9EF9A';
    }
  }

}
