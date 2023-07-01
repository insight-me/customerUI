import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-why-insightme',
  templateUrl: './why-insightme.component.html',
  styleUrls: ['./why-insightme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhyInsightmeComponent implements OnInit {
  public list = [
    {
      image: 'why-insightme-1',
      title: 'landing.FAST & AGILE',
      text1:
        'landing.Easy to use with quick consumer feedback provided in days.',
      text2:
        'landing.Possibility to easily tailor the research set up to your needs',
    },
    {
      image: 'why-insightme-2',
      title: 'landing.ACCURATE & ACTION-ORIENTED',
      text1:
        'landing.High quality data and advanced research methodologies for meaningful consumer insights presented in an actionable way',
    },
    {
      image: 'why-insightme-3',
      title: 'landing.INSIGHTFUL & CONSULTATIVE',
      text1:
        'landing.Choose among pre-designed research tests & get help in writing, improving and optimizing your concepts with the InsightMe AI automatic advisor.',
      text2:
        'landing.The experienced InsightMe team is always at your disposal',
    },
    {
      image: 'why-insightme-4',
      title: 'landing.CURIOUS & FUN',
      text1:
        'landing.Platform and questionnaire continuously being developed to be engaging & inspirational in our common ambition to create the next generation of food',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
