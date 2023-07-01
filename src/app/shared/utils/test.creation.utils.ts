import { RespondentRequirements, Test } from '../models/test.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { RespondentOptions } from '../models/test-creation.model';
import { MIN_RESP_NUMBER_PER_SEGMENT, NO_VALUE_GUIDE } from '../../../assets/consts/test-creation.const';
import { CategoryScreening, CategoryScreeningType } from '../enums/category-screening.type';
import { IncorrectSection } from '../enums/bic.creation.type';
import { TranslateService } from '@ngx-translate/core';
import { uniq } from 'lodash';
import { BTTest } from '../models/bt-test.model';

export class TestCreationUtils {
  public static getNumberOfRespondents(respondentRequirements: RespondentRequirements): number {
    let sum = 0;
    respondentRequirements?.countries?.forEach(country => {
      sum += country.respondentCount;
    });
    return sum || 0;
  }

  public static setZero(event: Event, control: FormControl): void {
    if ((event.target as HTMLInputElement).value === '') {
      control.setValue(0);
    }
    if ((event.target as HTMLInputElement).value.length > 1 && (event.target as HTMLInputElement).value[0] === '0') {
      control.setValue(+(event.target as HTMLInputElement).value.substr(1));
    }
  }

  public static createNewRespondentRequirements(respondentOptions: RespondentOptions): RespondentRequirements {
    return {
      minAge: 18,
      maxAge: 75,
      countries: [],
      genders: respondentOptions.genders.slice(0, -1),
      segments: [respondentOptions.segments.find(segment => segment.isDefault)],
      customSegments: [],
      subdivisions: [],
      isSegmentation: false,
      isCustomSegmentation: false,
      involvementCategoryId: NO_VALUE_GUIDE,
      involvementId: NO_VALUE_GUIDE,
      involvements: [],
      customInvolvements: [],
      customCategory: {
        categoryName: '',
      },
      categoryIRs: [],
      categoryDescription: '',
      allSegments: false,
      respondentRequirementSegmentCounts: [],
      categoryScreening: CategoryScreening.NotApplicable,
      categoryScreeningType: CategoryScreeningType.All,
      customCategoryScreens: [],
    };
  }

  public static getNumberPerSegment(segmentForm: FormArray): number {
    let num = 0;
    segmentForm?.controls.forEach(segment => {
      if ((segment as FormGroup)?.controls.respondentCount.valid) {
        num += (segment as FormGroup)?.controls.respondentCount.value;
      }
    });
    return num;
  }

  public static getMinCustomRespondentValue(respondentRequirements: RespondentRequirements): number {
    let num = 0;
    if (respondentRequirements.customSegments.length) {
      respondentRequirements.respondentRequirementSegmentCounts.forEach(element => {
        num += element.respondentCount;
      });
      num += 100;
      if (num < MIN_RESP_NUMBER_PER_SEGMENT + respondentRequirements.customSegments.length * MIN_RESP_NUMBER_PER_SEGMENT) {
        num = MIN_RESP_NUMBER_PER_SEGMENT + respondentRequirements.customSegments.length * MIN_RESP_NUMBER_PER_SEGMENT;
      }
    } else {
      num += 200;
    }
    return num;
  }

  public static getMinRespondentValue(respondentRequirements: RespondentRequirements): number {
    let num = 0;
    if (respondentRequirements.segments.length > 1) {
      respondentRequirements.respondentRequirementSegmentCounts.forEach(element => {
        num += element.respondentCount;
      });
      num += 100;
      if (num < MIN_RESP_NUMBER_PER_SEGMENT + (respondentRequirements.segments.length - 1) * MIN_RESP_NUMBER_PER_SEGMENT) {
        num = MIN_RESP_NUMBER_PER_SEGMENT + (respondentRequirements.segments.length - 1) * MIN_RESP_NUMBER_PER_SEGMENT;
      }
    } else {
      num += 200;
    }

    return num;
  }

  public static getValuesNotInvalid(form: FormGroup | FormArray): { subcategory: string; position: number }[] {
    const rawValues = form.getRawValue();
    Object.keys(form.controls).forEach(item => {
      if ((form.controls[item] as FormGroup).controls.subcategory.invalid) {
        delete rawValues[item];
      }
    });
    return rawValues;
  }

  public static getSubcategoryName(category, subcategories): string {
    return subcategories.find(item => item.id === category.id) ? subcategories.find(item => item.id === category.id).name : category.value;
  }

  public static getConfirmAndRunErrorsForBT(errors: number[], translateService: TranslateService): string {
    let messages = [];
    errors.forEach(err => {
      let message;
      switch (err) {
        case IncorrectSection.First:
          message = '- ' + translateService.instant('BT-create.Intro');
          break;
        case IncorrectSection.Second:
          message = '- ' + translateService.instant('BT-create.Choose respondents');
          break;
        case IncorrectSection.Third:
          message = '- ' + translateService.instant('BT-create.Brands');
          break;
        case IncorrectSection.Fourth:
          message = '- ' + translateService.instant('BT-create.KPIs');
          break;
        case IncorrectSection.Fifth:
          message = '- ' + translateService.instant('BT-create.Associations');
          break;
        case IncorrectSection.Sixth:
          message = '- ' + translateService.instant('BT-create.Additional questions');
          break;
        case IncorrectSection.Seventh:
          message = '- ' + translateService.instant('BT-create.Start date');
          break;
      }
      messages.push(message);
    });
    messages = uniq(messages.reverse());
    return messages.reverse().join('\n');
  }

  public static getConfirmAndRunErrorsForBIC(errors: number[][], translateService: TranslateService, test: Test): string {
    let messages = [];
    errors.forEach((error, i) => {
      error.forEach(err => {
        let message;
        switch (err) {
          case IncorrectSection.NoErrors:
            return;
          case IncorrectSection.First:
            message = translateService.instant('confirm-test.error-step1', {
              name: test.concepts[i].conceptName,
            });
            break;
          case IncorrectSection.Second:
            message = translateService.instant('confirm-test.error-step2');
            break;
          case IncorrectSection.Third:
            message = translateService.instant('confirm-test.error-step3');
            break;
          case IncorrectSection.Fourth:
            message = translateService.instant('confirm-test.error-step4');
            break;
          case IncorrectSection.Fifth:
            message = translateService.instant('confirm-test.error-step5');
        }
        messages.push(message);
      });
    });
    messages = uniq(messages.reverse());
    return messages.reverse().join('\n');
  }

  public static getCostInCurrency({ priceOfTest, currencyRate, testCurrency }: Test | BTTest): string {
    return `${Math.round(priceOfTest / currencyRate)?.toLocaleString('ru-RU', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })} ${testCurrency}`;
  }

  public static getCost(priceOfTest: number): string {
    return `${priceOfTest?.toLocaleString('ru-RU', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })} SEK`;
  }

  public static getSessionStorageFirstEnterTestKey(testId: string): { date: number; respondent: number } {
    return JSON.parse(sessionStorage.getItem(`first-${testId}`));
  }
}
