import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-relevance',
  templateUrl: './preview-relevance.component.html',
  styleUrls: ['./preview-relevance.component.scss']
})
export class PreviewRelevanceComponent {
  @Input() concept: any;
  @Input() type: number;

  constructor() { }

  public getTitle(): string {
    switch (this.type) {
      case 1:
        return 'relevance.concept-title';
      case 2:
        return 'relevance.benefit-title';
      case 3:
        return 'relevance.reason-title';
    }
  }
}
