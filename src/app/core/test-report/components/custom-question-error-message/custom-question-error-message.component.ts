import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BtReportStateService } from '../../bt/bt.report.state.service';

@Component({
  selector: 'app-custom-question-error-message',
  templateUrl: './custom-question-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomQuestionErrorMessageComponent implements OnInit {
  @Input() public margin = '0';
  public lowNumbers = false;

  constructor(private btRSS: BtReportStateService, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.lowNumbers = this.btRSS.getIntervalTotalsPopulationLow();
    this.cdr.detectChanges();
  }
}
