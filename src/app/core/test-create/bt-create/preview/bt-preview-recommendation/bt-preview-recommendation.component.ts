import { Component, Input, OnInit } from '@angular/core';
import { BTTest } from '../../../../../shared/models/bt-test.model';

@Component({
  selector: 'app-bt-preview-recommendation',
  templateUrl: './bt-preview-recommendation.component.html',
  styleUrls: ['./bt-preview-recommendation.component.scss']
})
export class BtPreviewRecommendationComponent implements OnInit {
  @Input() test: BTTest;
  @Input() category: string;
  constructor() { }

  ngOnInit(): void {
  }

}
