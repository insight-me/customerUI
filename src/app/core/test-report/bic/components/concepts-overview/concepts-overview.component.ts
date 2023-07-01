import { Component } from '@angular/core';
import { BicReportStateService } from '../../bic.report.state.service';

@Component({
  selector: 'app-concepts-overview',
  templateUrl: './concepts-overview.component.html',
  styleUrls: [ './concepts-overview.component.scss' ]
})
export class ConceptsOverviewComponent {

  constructor(public bicRSS: BicReportStateService) {
  }
}
