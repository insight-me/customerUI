import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {QuestionFeedback} from "../../../../../shared/models/bic.test.report/additional.questions.model";
import {AccumulatedFeedback} from "../../../../../shared/models/bic.test.report/test.concept.result.model";
import {IconsType} from "../../../../../shared/enums/icons.type";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-questions-feedback-item',
  templateUrl: './questions-feedback-item.component.html',
  styleUrls: ['./questions-feedback-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsFeedbackItemComponent implements OnInit {
  @Input() public question: QuestionFeedback;
  public IconsType = IconsType;

  public answers: AccumulatedFeedback[] = [];
  public isExpanded: boolean = false;

  constructor(
    public sanitizer: DomSanitizer,
  ) {
  }

  public ngOnInit(): void {
    this.answers = this.question.answers.slice(0, 3);
  }

  public toggleList(): void {
    if (this.isExpanded) {
      this.answers = this.question.answers.slice(0, 3);
    } else {
      this.answers = this.question.answers;
    }
    this.isExpanded = !this.isExpanded;
  }

  public getHtml(text: string): string {
    return text.replace(new RegExp('\n', 'gi'), '<br>');
  }
}
