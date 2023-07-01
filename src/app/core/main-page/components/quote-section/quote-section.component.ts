import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quote-section',
  templateUrl: './quote-section.component.html',
  styleUrls: ['./quote-section.component.scss', '../trusted-by/trusted-by.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteSectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
