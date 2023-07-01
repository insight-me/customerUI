import { Component, Input, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { CategoryScreening } from 'src/app/shared/enums/category-screening.type';
import { CategoryInvolvement } from 'src/app/shared/models/bt-test.model';
import { RespondentOptions } from 'src/app/shared/models/test-creation.model';
import {
  AnswerCustomQuestionType,
  CustomQuestionType,
  OrderCustomQuestionType
} from '../../../../../shared/enums/bic.custom-questions.type';
import {
  AnswersCustomQuestions
} from '../../../../../shared/models/bic.test/bic.custom.questions.model';
import {
  Involment,
  ListItem,
  RespondentRequirements
} from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { TestCreationUtils } from '../../../../../shared/utils/test.creation.utils';
import { CustomTranslateService } from './../../../../../shared/services/custom-translate.service';

@Component({
  selector: 'app-preview-category-screening',
  templateUrl: './preview-category-screening.component.html',
  styleUrls: [
    './preview-category-screening.component.scss',
    '../preview-feedback/preview-feedback.component.scss',
  ],
})
export class PreviewCategoryScreeningComponent implements OnInit {
  @Input() respondentRequirements: RespondentRequirements = null;
  public columns$: Observable<AnswersCustomQuestions[]>;
  get subcategories$(): Observable<CategoryInvolvement[]> {
    return this._customTranslateService.translatedCategories$.asObservable()
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        shareReplay()
      );
  }

  get respondentOptions$(): Observable<RespondentOptions> {
    return this._customTranslateService.translatedRespondentOptions$.asObservable()
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        shareReplay()
      );
  }

  constructor(
    public appStateService: AppStateService,
    public categoryService: BicCategoryService,
    private _customTranslateService: CustomTranslateService
  ) { }

  public ngOnInit(): void {
    this.columns$ = this.respondentOptions$.pipe(map((options) => this.getColumns(options.purchaseFrequencies)));
  }


  public get subtitle(): string {
    return 'preview.Please select one answer per row';
  }

  public get mobileSubtitle(): string {
    return 'preview.Please select one answer per column';
  }

  public get type(): CustomQuestionType {
    return CustomQuestionType.SingleGrid;
  }

  public get order(): OrderCustomQuestionType {
    return OrderCustomQuestionType.Order;
  }

  public get CategoryScreening(): typeof CategoryScreening {
    return CategoryScreening;
  }

  public get CustomQuestionType(): typeof CustomQuestionType {
    return CustomQuestionType;
  }

  public get AnswerCustomQuestionType(): typeof AnswerCustomQuestionType {
    return AnswerCustomQuestionType;
  }

  public getText(text: string): string[] {
    return text.trim().split('\n');
  }

  public getAnswers(subcategories): AnswersCustomQuestions[] {
    return orderBy(
      this.respondentRequirements.involvements
        .map((inv) => {
          return {
            ...inv,
            value: TestCreationUtils.getSubcategoryName(inv, subcategories),
          } as Involment;
        })
        .concat(
          this.respondentRequirements.customInvolvements.filter((item) =>
            TestCreationUtils.getValuesNotInvalid(
              this.categoryService.customSubcategoriesControl
            )
              .map((elem) => elem.subcategory)
              .includes(item.value)
          )
        ),
      (name) => name.value.toLowerCase()
    ).map((item, i) => {
      return {
        value: item.value,
        position: i,
      };
    });
  }

  public getColumns(purchaseFrequancies: ListItem[]): AnswersCustomQuestions[] {
    return purchaseFrequancies.map((item, i) => {
      return { position: i, value: item.value };
    });
  }

  public getExplanationText(
    type: CustomQuestionType,
    answerType: AnswerCustomQuestionType
  ): string {
    let text = '';
    if (answerType === AnswerCustomQuestionType.Default) {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you';
      }
    } else {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer per row';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you per row';
      }
    }
    return text;
  }

  public getMobileExplanationText(
    type: CustomQuestionType,
    answerType: AnswerCustomQuestionType
  ): string {
    let text = '';
    if (answerType === AnswerCustomQuestionType.Default) {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you';
      }
    } else {
      if (type === CustomQuestionType.Single) {
        text = 'preview.Please select one answer per column';
      }
      if (type === CustomQuestionType.Multi) {
        text = 'preview.Please select all answers that suits you per column';
      }
    }
    return text;
  }

  public getQuestionType(
    type: CustomQuestionType,
    answerType: AnswerCustomQuestionType
  ): CustomQuestionType {
    if (answerType === AnswerCustomQuestionType.Grid) {
      return type === CustomQuestionType.Single
        ? CustomQuestionType.SingleGrid
        : CustomQuestionType.MultiGrid;
    } else {
      return type;
    }
  }
}
