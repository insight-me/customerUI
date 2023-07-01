import {Component, Input} from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';

@Component({
  selector: 'app-respondent-overview',
  templateUrl: './respondent-overview.component.html',
  styleUrls: ['./respondent-overview.component.scss']
})
export class RespondentOverviewComponent {

  @Input() public pdfVersion = false;

  constructor(
    public bicRSS: BicReportStateService
  ) { }

}
