import { Injectable } from '@angular/core';
import { RespondentRequirements, Test, TestConcept } from '../../models/test.model';
import { IncorrectSection, SectionTitleType } from '../../enums/bic.creation.type';
import {
  BY_TWO_PARTS,
  FIFTH_PART,
  HALF_PART,
  MAX_BRAND_NAME_LENGTH,
  MAX_CONSUMER_INSIGHT_WORDS,
  MAX_IR,
  MAX_RESP_NUMBER_BIC,
  MAX_WIDTH,
  MIN_AGE_SPAN,
  MIN_ASSOCIATIONS_COUNT,
  MIN_BRAND_NAME_LENGTH,
  MIN_CONSUMER_INSIGHT_WORDS,
  MIN_IR,
  NO_WIDTH,
  ONE_ELEMENT_IN_ARRAY,
  OTHER_SEGMENT_ID,
  PROGRESS_FOR_LAST_STEP_BT,
  SIX_PARTS,
  WIDTH_EIGHTY,
} from 'src/assets/consts/test-creation.const';
import { MAX_AGE, MIN_AGE, MIN_CONSUMER_INSIGHT_LENGTH, NO_ORDER_ID } from '../../../../assets/consts/consts';
import { InvalidTestFieldsService } from '../test/invalid-test-fields.service';
import { BTTest } from '../../models/bt-test.model';
import { BicCategoryService } from '../bic-test/bic-category.service';
import { CategoryScreening } from '../../enums/category-screening.type';
import { isLateStartDate, isValidStartDateFormat } from '../../utils/date.utils';
import * as moment from 'moment';
import { invalidWordsNumber } from '../../validators/word.count.validator';

@Injectable({
  providedIn: 'root',
})
export class TestProgressService {
  private _currentConcept: TestConcept;
  private _test: Test | BTTest;
  private _respondentRequirements: RespondentRequirements;
  private _width = NO_WIDTH;
  private _widthForLastStep = NO_WIDTH;
  private _errorSection: number[] = [];

  constructor(private invalidFieldsService: InvalidTestFieldsService, private categoryService: BicCategoryService) {}

  public getWidthForProgressBIC(
    title: string,
    currentConcept: TestConcept,
    test: Test,
    respondentRequirements: RespondentRequirements
  ): { width: number; errorSection?: number[] } {
    this._currentConcept = currentConcept;
    this._test = test;
    this._respondentRequirements = respondentRequirements;
    this._width = NO_WIDTH;
    switch (title) {
      case SectionTitleType.First:
        this.getWidthForFirstSectionBIC();
        break;
      case SectionTitleType.Second:
        this.getWidthForSecondSectionBIC();
        break;
      case SectionTitleType.Third:
        this.getWidthForThirdSectionBIC();
        break;
      case SectionTitleType.Fourth:
        this.getWidthForFourthSectionBIC();
        break;
      case SectionTitleType.Fifth:
        this.getWidthForFifthSectionBIC();
        break;
      case SectionTitleType.Sixth:
        this.getWidthForSixthSectionBIC();
    }
    return title === SectionTitleType.Sixth
      ? {
          width: this._widthForLastStep > MAX_WIDTH ? MAX_WIDTH : Math.round(this._widthForLastStep),
          errorSection: this._errorSection,
        }
      : {
          width: this._width > MAX_WIDTH ? MAX_WIDTH : Math.round(this._width),
        };
  }

  public getWidthForProgressBT(
    title: string,
    test: BTTest,
    respondentRequirements: RespondentRequirements
  ): { width: number; errorSection?: number[] } {
    this._test = test;
    this._respondentRequirements = respondentRequirements;
    this._width = NO_WIDTH;
    switch (title) {
      case SectionTitleType.First:
        this._getWidthForIntroductionBT();
        break;
      case SectionTitleType.Second:
        this._getWidthForRespondentsBT();
        break;
      case SectionTitleType.Third:
        this._getWidthForBrandsBT();
        break;
      case SectionTitleType.Fourth:
        this._getWidthForKPIsBT();
        break;
      case SectionTitleType.Fifth:
        this._getWidthForAssociationsBT();
        break;
      case SectionTitleType.Sixth:
        this._getWidthForAdditionalQuestionsBT();
        break;
      case SectionTitleType.Seventh:
        this._getWidthForStartDateBT();
        break;
      case SectionTitleType.Eighth:
        this._getWidthForLastStepBT();
        break;
    }
    return title === SectionTitleType.Eighth
      ? {
          width: this._widthForLastStep > MAX_WIDTH ? MAX_WIDTH : Math.round(this._widthForLastStep),
          errorSection: this._errorSection,
        }
      : {
          width: this._width > MAX_WIDTH ? MAX_WIDTH : Math.round(this._width),
        };
  }

  private getWidthForFirstSectionBIC(): void {
    if (this._currentConcept?.id) {
      this._width += MAX_WIDTH / BY_TWO_PARTS;
    }
    if (
      this._currentConcept?.consumerInsight &&
      !invalidWordsNumber(MIN_CONSUMER_INSIGHT_WORDS, MAX_CONSUMER_INSIGHT_WORDS, this._currentConcept?.consumerInsight)
    ) {
      this._width += MAX_WIDTH / BY_TWO_PARTS;
    }
  }

  private getWidthForSecondSectionBIC(): void {
    if (this._test?.testKPIs.length && (this._test as Test)?.isEnterKPIStep) {
      this._width = MAX_WIDTH;
    }
  }

  private getWidthForThirdSectionBIC(): void {
    if ((this._test as Test)?.testAssociations.length + this._test?.customAssociations.length < MIN_ASSOCIATIONS_COUNT) {
      this._width = FIFTH_PART * ((this._test as Test)?.testAssociations.length + this._test?.customAssociations.length);
    } else {
      this._width = MAX_WIDTH;
    }
  }

  private getWidthForFourthSectionBIC(): void {
    if ((this._test as Test)?.testConceptRelevance !== null && this._test?.isEnterAdditionalQuestionStep) {
      this._width = MAX_WIDTH;
    }
  }

  private getWidthForFifthSectionBIC(): void {
    const part = SIX_PARTS;
    if (this._respondentRequirements !== null) {
      let validCountry = false;
      this._respondentRequirements.countries?.forEach(country => {
        if (
          country.id &&
          country.respondentCount &&
          this._respondentRequirements?.subdivisions.find(subdivision => {
            return subdivision.countryId === country.id;
          }) !== undefined &&
          !(country.respondentCount > MAX_RESP_NUMBER_BIC)
        ) {
          validCountry = true;
        }
      });
      if (validCountry) {
        this._width += MAX_WIDTH / part;
      }

      if (this.invalidFieldsService.getInvalidField(this._test?.id)?.countries?.length) {
        this._width -= MAX_WIDTH / part;
      }
      if (this._respondentRequirements?.genders?.length) {
        this._width += MAX_WIDTH / part;
      }
      this.getWidthForAges(part);
      this.getWidthForSegmentation(part);
      this.addWidthForCategoryInvolvments(10);
      this.addWidthForIRs(part);
      this.addWidthForCustomScreeningQuestion(part);
      let invalidSegment = false;
      if (
        (!this._respondentRequirements.isCustomSegmentation && !this._respondentRequirements?.isSegmentation) ||
        ((this._respondentRequirements.isCustomSegmentation || this._respondentRequirements.isSegmentation) &&
          this._respondentRequirements.allSegments)
      ) {
        invalidSegment = false;
      } else {
        if (this._respondentRequirements.respondentRequirementSegmentCounts.length) {
          let segmentCountSum = NO_WIDTH;
          this._respondentRequirements.respondentRequirementSegmentCounts.forEach(elem => {
            segmentCountSum += elem.respondentCount;
            if (elem.respondentCount < MAX_WIDTH) {
              invalidSegment = true;
            }
          });
          this._respondentRequirements.countries.forEach(elem => {
            let countrySum = NO_WIDTH;
            this._respondentRequirements.respondentRequirementSegmentCounts.forEach(count => {
              if (count.countryId === elem.id) {
                countrySum += count.respondentCount;
              }
            });
            if (elem.respondentCount < countrySum + elem.populationCount) {
              invalidSegment = true;
            }
          });
          if (invalidSegment) {
            this._width -= MAX_WIDTH / part;
          }
        }
      }
    }
  }

  private getWidthForSixthSectionBIC(): void {
    this._widthForLastStep = NO_WIDTH;
    this._errorSection = [];
    if (
      this.getWidthForProgressBIC(SectionTitleType.First, this._currentConcept, this._test as Test, this._respondentRequirements).width ===
      MAX_WIDTH
    ) {
      this._widthForLastStep += FIFTH_PART;
      this._errorSection.push(IncorrectSection.NoErrors);
    } else {
      this._errorSection.push(IncorrectSection.First);
    }
    if (
      this.getWidthForProgressBIC(SectionTitleType.Second, this._currentConcept, this._test as Test, this._respondentRequirements).width ===
      MAX_WIDTH
    ) {
      this._widthForLastStep += FIFTH_PART;
    } else {
      this._errorSection.push(IncorrectSection.Second);
    }
    if (
      this.getWidthForProgressBIC(SectionTitleType.Third, this._currentConcept, this._test as Test, this._respondentRequirements).width ===
      MAX_WIDTH
    ) {
      this._widthForLastStep += FIFTH_PART;
    } else {
      this._errorSection.push(IncorrectSection.Third);
    }
    if (
      this.getWidthForProgressBIC(SectionTitleType.Fourth, this._currentConcept, this._test as Test, this._respondentRequirements).width ===
      MAX_WIDTH
    ) {
      this._widthForLastStep += FIFTH_PART;
    } else {
      this._errorSection.push(IncorrectSection.Fourth);
    }
    if (
      this.getWidthForProgressBIC(SectionTitleType.Fifth, this._currentConcept, this._test as Test, this._respondentRequirements).width ===
      MAX_WIDTH
    ) {
      this._widthForLastStep += FIFTH_PART;
    } else {
      this._errorSection.push(IncorrectSection.Fifth);
    }
  }

  /** BT test */

  private _getWidthForIntroductionBT(): void {
    if ((this._test as BTTest)?.isAgreeSign) {
      this._width = MAX_WIDTH;
    }
  }

  private _getWidthForBrandsBT(): void {
    const own = (this._test as BTTest)?.brands?.filter(brand => brand.isOwn);
    const other = (this._test as BTTest)?.brands?.filter(brand => !brand.isOwn);
    const brandNames = (this._test as BTTest)?.brands.map(brand => brand.name);
    let isError = false;
    (this._test as BTTest)?.brands?.forEach((brand, i) => {
      const namesInArray = brandNames.filter(value => value === brand.name);
      if (
        brand.name &&
        brand.name.length >= MIN_BRAND_NAME_LENGTH &&
        namesInArray.length === ONE_ELEMENT_IN_ARRAY &&
        brand.name.length <= MAX_BRAND_NAME_LENGTH
      ) {
        this._width += HALF_PART;
      }
      if (
        !brand.name ||
        brand.name.length < MIN_BRAND_NAME_LENGTH ||
        namesInArray.length > ONE_ELEMENT_IN_ARRAY ||
        brand.name.length > MAX_BRAND_NAME_LENGTH
      ) {
        isError = true;
      }
      if (!own.length || !other.length) {
        isError = true;
      }
      const brandImages = (this._test as BTTest)?.brands?.filter(item => item.image || item.imageData);
      if (brandImages.length && brandImages.length !== (this._test as BTTest)?.brands?.length) {
        isError = true;
      }
    });
    if (this._width >= MAX_WIDTH && isError) {
      this._width = WIDTH_EIGHTY;
    }
    if (this._width >= MAX_WIDTH && !isError) {
      this._width = MAX_WIDTH;
    }
  }

  private _getWidthForKPIsBT(): void {
    if ((this._test as BTTest)?.testKPIs.length && (this._test as Test)?.isEnterKPIStep) {
      this._width = MAX_WIDTH;
    }
  }

  private _getWidthForAssociationsBT(): void {
    if ((this._test as BTTest)?.btTestAssociations.length + (this._test as BTTest)?.customAssociations.length < MIN_ASSOCIATIONS_COUNT) {
      this._width = FIFTH_PART * ((this._test as BTTest)?.btTestAssociations.length + (this._test as BTTest)?.customAssociations.length);
    } else {
      this._width = MAX_WIDTH;
    }
  }

  private _getWidthForAdditionalQuestionsBT(): void {
    if ((this._test as BTTest)?.isEnterAdditionalQuestionStep) {
      this._width = MAX_WIDTH;
    }
  }

  private _getWidthForRespondentsBT(): void {
    const part = 5;
    if (this._respondentRequirements === null) {
      this._width = MAX_WIDTH / part;
    } else {
      if (!this._respondentRequirements.countries || !this._respondentRequirements.countries?.length) {
        this._width -= MAX_WIDTH / part;
      }
      let validCountry = true;
      this._respondentRequirements.countries?.forEach(country => {
        if (
          !(
            country.id &&
            country.respondentCount &&
            country.respondentCount <= MAX_RESP_NUMBER_BIC &&
            this._test?.respondentRequirements?.subdivisions.find(subdivision => {
              return subdivision.countryId === country.id;
            }) !== undefined
          )
        ) {
          validCountry = false;
        }
      });
      if (validCountry) {
        this._width += MAX_WIDTH / part;
      }
      if (this._respondentRequirements?.genders?.length) {
        this._width += MAX_WIDTH / part;
      }
      this.getWidthForAges(part);
      this.addWidthForCategoryInvolvments(MAX_WIDTH / part);
      this.addWidthForCustomScreeningQuestion(part);
    }
  }

  private _getWidthForStartDateBT(): void {
    const isDateValid = moment((this._test as BTTest)?.startDate).isValid();
    if ((this._test as BTTest)?.startDate) {
      if (
        !isLateStartDate(new Date(Date.parse((this._test as BTTest)?.startDate as string))) &&
        isDateValid &&
        !isValidStartDateFormat(this._test?.startDate)
      ) {
        this._width = MAX_WIDTH;
      }
    }
  }

  private _getWidthForLastStepBT(): void {
    this._errorSection = [];
    this._widthForLastStep = NO_WIDTH;
    this._progressPartForLastStepBT('First');
    this._progressPartForLastStepBT('Second');
    this._progressPartForLastStepBT('Third');
    this._progressPartForLastStepBT('Fourth');
    this._progressPartForLastStepBT('Fifth');
    this._progressPartForLastStepBT('Sixth');
    this._progressPartForLastStepBT('Seventh');
  }

  /** for all tests */

  private addWidthForCategoryInvolvments(part: number): void {
    if (
      this._respondentRequirements?.involvementCategoryId === OTHER_SEGMENT_ID &&
      this._respondentRequirements?.customCategory?.categoryName
    ) {
      this._width += part;
    } else {
      if (
        this._respondentRequirements?.involvementCategoryId !== NO_ORDER_ID &&
        this._respondentRequirements?.involvementCategoryId !== OTHER_SEGMENT_ID
      ) {
        this._width += part;
      }
    }
    if (
      (this._respondentRequirements?.involvements.length && !this._respondentRequirements?.customInvolvements.length) ||
      (this._respondentRequirements?.customInvolvements.length && this.categoryService.isCustomSubcategoryControlValid) ||
      (this._respondentRequirements?.customInvolvements.length &&
        this.categoryService.isCustomSubcategoryControlValid &&
        this._respondentRequirements?.involvements.length)
    ) {
      this._width += part;
    }
  }

  private addWidthForIRs(part: number): void {
    if (this._respondentRequirements?.categoryIRs.length === this._respondentRequirements?.countries.length) {
      let invalid = false;
      this._respondentRequirements?.categoryIRs.forEach(IR => {
        if (IR.ir < MIN_IR || IR.ir > MAX_IR) {
          invalid = true;
        }
      });
      this._width += invalid ? NO_WIDTH : MAX_WIDTH / part;
    }
  }

  private getWidthForAges(part: number): void {
    if (
      this._respondentRequirements?.minAge &&
      this._respondentRequirements?.maxAge &&
      this._respondentRequirements?.minAge >= MIN_AGE &&
      this._respondentRequirements?.maxAge <= MAX_AGE &&
      this._respondentRequirements?.maxAge >= this._respondentRequirements?.minAge + MIN_AGE_SPAN
    ) {
      this._width += MAX_WIDTH / part;
    }
  }

  private getWidthForSegmentation(part: number): void {
    if (this._respondentRequirements?.isSegmentation && this._respondentRequirements?.segments.length > ONE_ELEMENT_IN_ARRAY) {
      this._width += MAX_WIDTH / part;
    }
    if (!this._respondentRequirements?.isSegmentation && !this._respondentRequirements?.isCustomSegmentation) {
      this._width += MAX_WIDTH / part;
    }
    if (this._respondentRequirements?.isCustomSegmentation && this._respondentRequirements?.customSegments.length) {
      this._width += MAX_WIDTH / part;
    }
  }

  private addWidthForCustomScreeningQuestion(part: number): void {
    if (
      this._respondentRequirements?.categoryScreening === CategoryScreening.Customized &&
      !this._respondentRequirements?.customCategoryScreens.length
    ) {
      this._width -= MAX_WIDTH / part;
    }
  }

  private _progressPartForLastStepBT(step: string): void {
    if (this.getWidthForProgressBT(SectionTitleType[step], this._test as BTTest, this._respondentRequirements).width === MAX_WIDTH) {
      this._widthForLastStep += PROGRESS_FOR_LAST_STEP_BT;
    } else {
      this._errorSection.push(IncorrectSection[step]);
    }
  }
}
