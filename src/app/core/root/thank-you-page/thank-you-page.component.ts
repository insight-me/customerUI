import { Component, OnInit } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';

@Component({
  selector: 'app-thank-you-page',
  templateUrl: './thank-you-page.component.html',
  styleUrls: [
    './thank-you-page.component.scss',
    '../../../shared/components/payment-success/payment-success.component.scss',
  ],
})
export class ThankYouPageComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }
}
