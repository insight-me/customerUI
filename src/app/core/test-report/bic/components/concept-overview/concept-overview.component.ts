import { Component, Input, OnInit } from '@angular/core';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';

@Component({
  selector: 'app-concept-overview',
  templateUrl: './concept-overview.component.html',
  styleUrls: [ './concept-overview.component.scss' ]
})
export class ConceptOverviewComponent implements OnInit {
  @Input() concept: ConsumerInsightModel;

  constructor() {
  }

  ngOnInit(): void {
  }
  public getConsumerInsight( text: string ): string[] {
    return text?.trim().split('\n');
  }

  public getBenefits(): string {
    if (this.concept) {
      const benefits = [];
      this.concept.concept.benefits.forEach((benefit) => {
        const benefitTrim = benefit.value.trim();
        if (benefitTrim[benefitTrim.length - 1] === '.') {
          benefits.push(
            benefitTrim[0].toUpperCase() +
            benefitTrim.slice(1, benefitTrim.length - 1)
          );
        } else {
          benefits.push(
            benefitTrim[0].toUpperCase() + benefitTrim.slice(1)
          );
        }
      });
      const result = benefits.join('. ');
      return result[0].toUpperCase() + result.slice(1) + '.';
    }
  }

  public getReason(reason: string): string {
    const reasonTrim = reason.trim();
    if (reasonTrim[reasonTrim.length - 1] === '.') {
      return reasonTrim[0].toUpperCase() + reasonTrim.slice(1);
    } else {
      return reasonTrim[0].toUpperCase() + reasonTrim.slice(1) + '.';
    }
  }
}
