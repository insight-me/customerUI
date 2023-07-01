import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { map } from 'lodash';
import { Subscription } from 'rxjs';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { TestType } from 'src/app/shared/enums/product.id.type';
import { BTTest } from 'src/app/shared/models/bt-test.model';
import { askRadioBtns } from 'src/assets/consts/ask-radio-btns';
import { NO_SPACE_PATTERN } from '../../../../../../assets/consts/consts';
import {
  MAX_OPEN_QUESTION_OPTION_LENGTH,
  MIN_OPEN_QUESTION_OPTION_LENGTH
} from '../../../../../../assets/consts/test-creation.const';
import {
  AnswerCustomQuestionType,
  CustomQuestionType,
  OrderCustomQuestionType
} from '../../../../enums/bic.custom-questions.type';
import {
  AnswersCustomQuestions, ColumnsCustomQuestions,
  CustomQuestions
} from '../../../../models/bic.test/bic.custom.questions.model';
import { RadioBtnsOpenQuestions } from '../../../../models/test-creation.model';
import { Test } from '../../../../models/test.model';
import { checkExist } from '../../../../validators/check-exist.validator';



@Component({
  selector: 'app-open-questions',
  templateUrl: './open-questions.component.html',
  styleUrls: ['./open-questions.component.scss'],
})
export class OpenQuestionsComponent implements OnDestroy {
  @Input() set test(test: Test | BTTest) {
    if (test) {
      this._test = test;
      this.initForm();
      this.initRadioButtonsList();
    }
  }

  get test(): Test | BTTest {
    return this._test;
  }

  get isBic(): boolean {
    return this.test.testType === TestType.BIC;
  }

  @Output() updateCustomQuestions: EventEmitter<CustomQuestions> =
    new EventEmitter();
  @Output() deleteCustomQuestion: EventEmitter<number> = new EventEmitter();
  public form: FormGroup;
  public isShowQuestions = false;
  public radioBtnsList: RadioBtnsOpenQuestions[];
  public answers: AnswersCustomQuestions[] = [];
  public columns: ColumnsCustomQuestions[] = [];
  public askRadioBtns = askRadioBtns;
  private _test: Test | BTTest;
  private _includeDoNotKnow = false;
  private _subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder) { }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get includeDoNotKnow(): boolean {
    return this._includeDoNotKnow;
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public get CustomQuestionType(): typeof CustomQuestionType {
    return CustomQuestionType;
  }

  public controlHasError(): any {
    if (this.form.controls.value.touched && this.form.controls.value.invalid) {
      return this.form.controls.value.errors;
    }
    return null;
  }

  public getErrorMessage(error: any): string {
    if (error) {
      if (error.checkExist) {
        return 'test-concept.error-exist-question';
      } else {
        if (error.pattern) {
          return 'BIC.Custom question can not be empty';
        }
        return 'test-concept.custom-question-error-length';
      }
    }
  }

  public toggleIsShowQuestion(): void {
    this.isShowQuestions = !this.isShowQuestions;
  }

  public openHint(event): void {
    event.preventDefault();
  }

  public trimValue(): void {
    this.form.controls.value.setValue(this.form.controls.value.value.trim());
  }

  public onUpdateDoNotKnowOption(includeDoNotKnow: boolean): void {
    this._includeDoNotKnow = includeDoNotKnow;
  }

  public saveQuestion(): void {
    const customQuestion = this.form.getRawValue();
    customQuestion.answers = this.answers;
    customQuestion.columns = this.columns;
    customQuestion.isDontKnowOption = this._includeDoNotKnow;
    if (this._includeDoNotKnow) {
      customQuestion.columns.push({ position: -1, value: 'Dont know' });
    }
    if (this.form.controls.type.value === CustomQuestionType.MultiGrid) {
      customQuestion.answerType = AnswerCustomQuestionType.Grid;
      customQuestion.type = CustomQuestionType.Multi;
    }
    if (this.form.controls.type.value === CustomQuestionType.SingleGrid) {
      customQuestion.answerType = AnswerCustomQuestionType.Grid;
      customQuestion.type = CustomQuestionType.Single;
    }
    this.updateCustomQuestions.emit(customQuestion);
    this.form.controls.value.reset();
    this.toggleIsShowQuestion();
    this.updateValidityForValue();
  }

  public updateOptions(options: string[]): void {
    this.answers = [];
    options.forEach((option, i) => {
      const optionElement = {
        position: i,
        value: option,
      };
      this.answers.push(optionElement);
    });
  }

  public updateColumns(options: string[]): void {
    this.columns = [];
    if (!options.length) {
      this._includeDoNotKnow = false;
    }
    options.forEach((option, i) => {
      const optionElement = {
        position: i,
        value: option,
      };
      this.columns.push(optionElement);
    });
  }

  public deleteQuestion(i: number): void {
    this.deleteCustomQuestion.emit(i);
    this.updateValidityForValue();
  }

  public onChangeType(): void {
    this.columns = [];
    this.answers = [];
    this._includeDoNotKnow = false;
  }

  public resetData(): void {
    this.form.controls.value.reset();
  }

  private updateValidityForValue(): void {
    this.form.controls.value.setValidators([
      Validators.required,
      Validators.minLength(MIN_OPEN_QUESTION_OPTION_LENGTH),
      Validators.maxLength(MAX_OPEN_QUESTION_OPTION_LENGTH),
      Validators.pattern(NO_SPACE_PATTERN),
      checkExist(map(this.test.customQuestions, 'value')),
    ]);
    this.form.controls.value.updateValueAndValidity();
  }

  private initRadioButtonsList(): void {
    this.radioBtnsList = [
      {
        name: 'Text',
        formControl: this.convertToFormControl(this.form.controls.type),
        value: CustomQuestionType.Open,
        withHint: false,
      },
      {
        name: 'Scale 1-7',
        formControl: this.convertToFormControl(this.form.controls.type),
        value: CustomQuestionType.Scale,
        withHint: false,
      },
      {
        name: 'Single choice',
        formControl: this.convertToFormControl(this.form.controls.type),
        value: CustomQuestionType.Single,
        withHint: false,
      },
      {
        name: 'Multiple choice',
        formControl: this.convertToFormControl(this.form.controls.type),
        value: CustomQuestionType.Multi,
        withHint: false,
      },
      {
        name: 'Single choice grid',
        formControl: this.convertToFormControl(this.form.controls.type),
        value: CustomQuestionType.SingleGrid,
        withHint: true,
        hintText:
          'BIC.The Single choice grid question enables respondents to choose one answer option per row or column for a specific question.',
      },
      {
        name: 'Multi choice grid',
        formControl: this.convertToFormControl(this.form.controls.type),
        value: CustomQuestionType.MultiGrid,
        withHint: true,
        hintText:
          'BIC.The multiple choice grid question enables respondents to choose multiple answer options per row or column in a particular question.',
      },
    ];
  }

  private initForm(): void {
    this.form = this.fb.group({
      value: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_OPEN_QUESTION_OPTION_LENGTH),
          Validators.maxLength(MAX_OPEN_QUESTION_OPTION_LENGTH),
          Validators.pattern(NO_SPACE_PATTERN),
          checkExist(map(this.test.customQuestions, 'value')),
        ],
      ],
      type: CustomQuestionType.Open,
      answerType: 0,
      answerOrderType: OrderCustomQuestionType.Alphabetic,
      columnOrderType: OrderCustomQuestionType.Alphabetic,
      imageBase: '',
      minValue: 1,
      maxValue: 7,
      IsAskOnce: false
    });
    this._subscription.add(
      this.form.controls.type.valueChanges.subscribe(() => {
        this.answers = [];
        this.columns = [];
      })
    );
  }
}
