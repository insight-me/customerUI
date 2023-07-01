import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { map, omit, sortBy } from 'lodash';
import { Subscription } from 'rxjs';
import { NO_SPACE_PATTERN } from '../../../../assets/consts/consts';
import {
  MAX_OPEN_QUESTION_OPTION_LENGTH,
  MIN_OPEN_QUESTION_OPTION_LENGTH
} from '../../../../assets/consts/test-creation.const';
import { BicCreateService } from '../../../core/test-create/bic-create/services/bic-create.service';
import { RespondentsService } from '../../../core/test-create/bic-create/services/respondents.service';
import { BtStateService } from '../../../core/test-create/bt-create/services/bt-state.service';
import {
  AnswerCustomQuestionType,
  CustomQuestionsType,
  CustomQuestionType,
  OrderCustomQuestionType
} from '../../enums/bic.custom-questions.type';
import { CategoryScreeningType } from '../../enums/category-screening.type';
import { IconsType } from '../../enums/icons.type';
import { TestType } from '../../enums/product.id.type';
import {
  AnswersCustomQuestions,
  ColumnsCustomQuestions,
  CustomQuestions,
  CustomQuestionsScreening
} from '../../models/bic.test/bic.custom.questions.model';
import { Involment, RespondentRequirements } from '../../models/test.model';
import { BicCategoryService } from '../../services/bic-test/bic-category.service';
import { BicTestService } from '../../services/bic-test/bic-test.service';
import { BtTestService } from '../../services/bt-test/bt-test.service';
import { TestCreationUtils } from '../../utils/test.creation.utils';
import { checkExist } from '../../validators/check-exist.validator';

enum ScreeningCustomSteps {
  Single = 0,
  Multi = 1,
  SingleGrid = 2,
  MultiGrid = 3,
}

@Component({
  selector: 'app-custom-screening',
  templateUrl: './custom-screening.component.html',
  styleUrls: [
    './custom-screening.component.scss',
    '../components/open-questions/open-questions/open-questions.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomScreeningComponent implements OnDestroy {
  @Input() set respondentRequirements(
    respondentRequirements: RespondentRequirements
  ) {
    this._respondentRequirements = respondentRequirements;
    if (respondentRequirements && !this.optionsForm) {
      this._initForm();
      this._initRadioButtonsList();
    }
  }

  @Input() testType: TestType;

  public optionLength = { min: 1, max: 50 };
  public isCanAddQuestion = true;
  public optionsForm: FormGroup = null;
  public typeList = [];

  private _respondentRequirements: RespondentRequirements = null;
  private _questionCategoryScreeningType = CategoryScreeningType.All;
  private _selectedItems: string[] = [];
  private _gridSelectedItems: string[] = [];
  private _answers: AnswersCustomQuestions[] = [];
  private _columns: ColumnsCustomQuestions[] = [];
  private _includeDoNotKnow = false;
  private _subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private bicRespondentsService: RespondentsService,
    private bicCreateService: BicCreateService,
    private bicTestService: BicTestService,
    private categoryService: BicCategoryService,
    private btTestService: BtTestService,
    private btStateService: BtStateService
  ) { }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get CustomQuestionsType(): typeof CustomQuestionsType {
    return CustomQuestionsType;
  }

  public get isDisabledSaveAnswer(): boolean {
    if (
      this.optionsForm.controls.type.value === CustomQuestionType.SingleGrid ||
      this.optionsForm.controls.type.value === CustomQuestionType.MultiGrid
    ) {
      let invalid = !this._gridSelectedItems.length;
      const selectedRows = this._gridSelectedItems.map(
        (item) => item.split(' / ')[0]
      );
      this._answers.forEach((answer) => {
        if (!selectedRows.includes(answer.value)) {
          invalid = true;
        }
      });
      return this.optionsForm.invalid || invalid;
    } else {
      return (
        this.optionsForm.invalid ||
        this._answers.length < 2 ||
        !this._selectedItems.length
      );
    }
  }

  public get isShowPreview(): boolean {
    return this._answers.length > 0 && this._columns.length > 1;
  }

  public get columns(): ColumnsCustomQuestions[] {
    return this._columns;
  }

  public get respRequirements(): RespondentRequirements {
    return this._respondentRequirements;
  }

  public get answers(): AnswersCustomQuestions[] {
    return this._answers;
  }

  public get includeDoNotKnow(): boolean {
    return this._includeDoNotKnow;
  }

  public get selectedItems(): string[] {
    return this._selectedItems;
  }

  public get gridSelectedOptions(): string[] {
    return this._gridSelectedItems;
  }

  public get questionCategoryScreeningType(): CategoryScreeningType {
    return this._questionCategoryScreeningType;
  }

  public get questions(): CustomQuestionsScreening[] {
    return this._respondentRequirements.customCategoryScreens;
  }

  public get stringAnswers(): string[] {
    return this._answers.map((item) => item.value);
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public controlHasError(): any {
    if (
      this.optionsForm.controls.value.touched &&
      this.optionsForm.controls.value.invalid
    ) {
      return this.optionsForm.controls.value.errors;
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

  public trimValue(control: FormControl): void {
    control.setValue(control.value.trim());
  }

  public isShowSingleOrMulti(i: number): boolean {
    return (
      (i === ScreeningCustomSteps.Single &&
        this.optionsForm.controls.type.value === CustomQuestionType.Single) ||
      (i === ScreeningCustomSteps.Multi &&
        this.optionsForm.controls.type.value === CustomQuestionType.Multi)
    );
  }

  public isShowGrid(i: number): boolean {
    return (
      (i === ScreeningCustomSteps.SingleGrid &&
        this.optionsForm.controls.type.value ===
        CustomQuestionType.SingleGrid) ||
      (i === ScreeningCustomSteps.MultiGrid &&
        this.optionsForm.controls.type.value === CustomQuestionType.MultiGrid)
    );
  }

  public onUpdateOptions(options: string[]): void {
    const newAnswers = [];
    options.forEach((option, i) => {
      const optionElement = {
        position: i,
        value: option,
        isApproved: this._selectedItems.includes(option),
      };
      newAnswers.push(optionElement);
    });
    this._answers = newAnswers;
    this._updateSelectedValues();
  }

  public onUpdateColumns(options: string[]): void {
    this._columns = [];
    if (!options.length) {
      this.onUpdateDoNotKnowOption(false);
    }
    options.forEach((option, i) => {
      const optionElement = {
        position: i,
        value: option,
      };
      this._columns.push(optionElement);
    });
    this._updateSelectedValues();
  }

  public onUpdateSelectedItems(items: string[]): void {
    this._answers.forEach(
      (item) => (item.isApproved = items.includes(item.value))
    );
    this._selectedItems = items;
  }

  public onUpdateSelectedGridItems(items: string[]): void {
    this._gridSelectedItems = items;
  }

  public onStartAddingQuestion(): void {
    this.isCanAddQuestion = false;
    this.optionsForm.controls.value.reset();
    this.optionsForm.controls.type.reset();
  }

  public onUpdateCategoryScreeningType(type: CategoryScreeningType): void {
    this._questionCategoryScreeningType = type;
  }

  public onUpdateCategoryScreeningTypeForQuestions(
    type: CategoryScreeningType
  ): void {
    this.bicRespondentsService.updateCategoryScreeningType(type);
  }

  public onSaveQuestion(): void {
    const screeningQuestion = this.optionsForm.getRawValue();
    screeningQuestion.answers = this.answers;
    screeningQuestion.columns = this.columns;
    screeningQuestion.isDontKnowOption = this._includeDoNotKnow;
    if (this._includeDoNotKnow) {
      screeningQuestion.columns.push({ position: -1, value: 'Dont know' });
    }
    screeningQuestion.approveAnswers = [];
    screeningQuestion.categoryScreeningType =
      this._questionCategoryScreeningType;
    if (this._gridSelectedItems.length) {
      this._gridSelectedItems.forEach((item) => {
        if (
          (this._answers.find(
            (answer) => answer.value === item.split(' / ')[0]
          ) &&
            this._columns.find(
              (answer) => answer.value === item.split(' / ')[1]
            )) ||
          item.split(' / ')[1] === '-1'
        ) {
          const approvedItem = {
            answerPosition: this._answers.find(
              (answer) => answer.value === item.split(' / ')[0]
            ).position,
            answerColPosition:
              item.split(' / ')[1] === '-1'
                ? -1
                : this._columns.find(
                  (answer) => answer.value === item.split(' / ')[1]
                ).position,
          };
          screeningQuestion.approveAnswers.push(approvedItem);
        }
      });
    }
    if (this.optionsForm.controls.type.value === CustomQuestionType.MultiGrid) {
      screeningQuestion.answerType = AnswerCustomQuestionType.Grid;
      screeningQuestion.type = CustomQuestionType.Multi;
      this._setSubCategoryId(screeningQuestion);
    }
    if (
      this.optionsForm.controls.type.value === CustomQuestionType.SingleGrid
    ) {
      screeningQuestion.answerType = AnswerCustomQuestionType.Grid;
      screeningQuestion.type = CustomQuestionType.Single;
      this._setSubCategoryId(screeningQuestion);
    }
    if (this.optionsForm.controls.type.value === CustomQuestionType.Single) {
      screeningQuestion.categoryScreeningType = CategoryScreeningType.One;
    }
    this.bicRespondentsService.updateCustomScreeningQuestions(
      screeningQuestion
    );
    this.optionsForm.controls.value.reset();
    this.onChangeType();
    this.onToggleIsShowQuestion();
    this._updateValidityForValue();
    this._saveScreeningQuestions();
  }

  public onDeleteQuestion(num: number): void {
    this.bicRespondentsService.deleteCustomScreeningQuestion(num);
    this._updateValidityForValue();
    this._saveScreeningQuestions();
  }

  public onToggleIsShowQuestion(): void {
    this.isCanAddQuestion = !this.isCanAddQuestion;
  }

  public onUpdateDoNotKnowOption(includeDoNotKnow: boolean): void {
    this._includeDoNotKnow = includeDoNotKnow;
    if (!this._includeDoNotKnow) {
      this._gridSelectedItems = this._gridSelectedItems.filter(
        (item) => item.split(' / ')[1] !== '-1'
      );
    }
  }

  public onChangeType(): void {
    this._columns = [];
    this._answers = [];
    this._selectedItems = [];
    this._gridSelectedItems = [];
    this._includeDoNotKnow = false;
    this._questionCategoryScreeningType = CategoryScreeningType.All;
    if (this._isGridType()) {
      this._answers = sortBy(this._getSelectedSubcategories(), 'value');
    }
  }

  public onOpenHint(event): void {
    event.preventDefault();
  }

  private _initForm(): void {
    this.optionsForm = this.fb.group({
      value: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_OPEN_QUESTION_OPTION_LENGTH),
          Validators.maxLength(MAX_OPEN_QUESTION_OPTION_LENGTH),
          Validators.pattern(NO_SPACE_PATTERN),
          checkExist(
            map(this._respondentRequirements.customCategoryScreens, 'value')
          ),
        ],
      ],
      type: Validators.required,
      answerType: 0,
      answerOrderType: OrderCustomQuestionType.Alphabetic,
      columnOrderType: OrderCustomQuestionType.Alphabetic,
    });
  }

  private _initRadioButtonsList(): void {
    this.typeList = [
      {
        name: 'Single choice',
        formControl: this.convertToFormControl(this.optionsForm.controls.type),
        value: CustomQuestionType.Single,
        withHint: false,
      },
      {
        name: 'Multiple choice',
        formControl: this.convertToFormControl(this.optionsForm.controls.type),
        value: CustomQuestionType.Multi,
        withHint: false,
      },
      {
        name: 'Single choice grid',
        formControl: this.convertToFormControl(this.optionsForm.controls.type),
        value: CustomQuestionType.SingleGrid,
        withHint: true,
        hintText:
          'BIC.The Single choice grid question enables respondents to choose one answer option per row or column for a specific question.',
      },
      {
        name: 'Multi choice grid',
        formControl: this.convertToFormControl(this.optionsForm.controls.type),
        value: CustomQuestionType.MultiGrid,
        withHint: true,
        hintText:
          'BIC.The multiple choice grid question enables respondents to choose multiple answer options per row or column in a particular question.',
      },
    ];
  }

  private _updateValidityForValue(): void {
    this.optionsForm.controls.value.setValidators([
      Validators.required,
      Validators.minLength(MIN_OPEN_QUESTION_OPTION_LENGTH),
      Validators.maxLength(MAX_OPEN_QUESTION_OPTION_LENGTH),
      Validators.pattern(NO_SPACE_PATTERN),
      checkExist(
        map(this._respondentRequirements.customCategoryScreens, 'value')
      ),
    ]);
    this.optionsForm.controls.value.updateValueAndValidity();
  }

  private _saveScreeningQuestions(): void {
    if (this.testType === TestType.BIC) {
      this.bicTestService
        .updateTest(
          omit(
            {
              ...this.bicCreateService.currentTest$.getValue(),
              respondentRequirements: this._respondentRequirements,
            },
            ['concepts']
          )
        )
        .subscribe((res) => {
          this.bicCreateService.currentTest$.next(res);
        });
    } else {
      this.btTestService
        .updateTest({
          ...this.btStateService.currentTest$.getValue(),
          respondentRequirements: this._respondentRequirements,
        })
        .subscribe((res) => {
          this.btStateService.currentTest$.next(res);
        });
    }
  }

  private _isGridType(): boolean {
    return (
      this.optionsForm.controls.type.value === CustomQuestionType.SingleGrid ||
      this.optionsForm.controls.type.value === CustomQuestionType.MultiGrid
    );
  }

  private _getSelectedSubcategories(): AnswersCustomQuestions[] {
    return this._getInvolvements()
      .concat(
        this._respondentRequirements.customInvolvements.filter((item) =>
          TestCreationUtils.getValuesNotInvalid(
            this.categoryService.customSubcategoriesControl
          )
            .map((elem) => elem.subcategory)
            .includes(item.value)
        )
      )
      .map((item, i) => {
        return {
          position: i,
          value: item.value,
        };
      });
  }

  private _getInvolvements(): Involment[] {
    return this._respondentRequirements.involvements.map((inv) => {
      return {
        ...inv,
        value: this.getSubcategoryName(inv),
      } as Involment;
    });
  }

  private _updateSelectedValues(): void {
    this._selectedItems = this._selectedItems.filter((item) =>
      this._answers.map((opt) => opt.value).includes(item)
    );
    this._gridSelectedItems = this._gridSelectedItems.filter(
      (item) =>
        this._columns.map((opt) => opt.value).includes(item.split(' / ')[1]) ||
        (item.split(' / ')[1] === '-1' && this._includeDoNotKnow)
    );
  }

  private _setSubCategoryId(screeningQuestion: CustomQuestions): void {
    screeningQuestion.answers.forEach((answer, i) => {
      if (this._getInvolvements().find((inv) => inv.value === answer.value)) {
        screeningQuestion.answers[i].subCategoryId =
          this._getInvolvements().find((inv) => inv.value === answer.value).id;
      } else {
        screeningQuestion.answers[i].subCategoryId = null;
      }
    });
  }

  public getSubcategoryName(category): string {
    return this.categoryService.subcategories.find(
      (item) => item.id === category.id
    )
      ? this.categoryService.subcategories.find(
        (item) => item.id === category.id
      ).name
      : category.value;
  }
}
