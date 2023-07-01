import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-report-info-message',
  templateUrl: './report-info-message.component.html',
  styleUrls: ['./report-info-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportInfoMessageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
