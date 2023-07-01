import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AdditionalQuestionsModel} from "../../../../../shared/models/bic.test.report/additional.questions.model";

@Component({
  selector: 'app-questions-feedback',
  templateUrl: './questions-feedback.component.html',
  styleUrls: ['./questions-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsFeedbackComponent {
  @Input() public dataSet: AdditionalQuestionsModel;
}
