import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MAX_NUMBER_OF_RESPONDENTS_PER_COUNTRY_BT, MIN_NUMBER_OF_RESPONDENTS_PER_COUNTRY_BT } from 'src/assets/consts/bt-test.consts';
import { INPUT_MAX_LENGTH, MAX_AGE, MIN_AGE, SEGMENT_TYPES } from '../../../../../assets/consts/consts';
import {
  MAX_IR,
  MAX_MIN_AGE,
  MAX_RESP_NUMBER_BIC,
  MIN_IR,
  MIN_MAX_AGE,
  MIN_RESP_NUMBER_PER_SEGMENT
} from '../../../../../assets/consts/test-creation.const';
import { CategoryScreeningType } from '../../../../shared/enums/category-screening.type';
import { TestType } from '../../../../shared/enums/product.id.type';
import { CustomQuestionsScreening } from '../../../../shared/models/bic.test/bic.custom.questions.model';
import { CategoryInvolvement } from '../../../../shared/models/bt-test.model';
import { Involment, ListItem, RespondentRequirements } from '../../../../shared/models/test.model';
import { AppStateService } from '../../../../shared/services/app-state/app-state.service';
import { TestCreationUtils } from '../../../../shared/utils/test.creation.utils';
import { compareNumbers } from '../../../../shared/validators/compare-numbers.validator';
import { CustomValidator } from '../../../../shared/validators/custom.validator';
import { SegmentationTypes, SegmentationTypesWithoutNot } from '../../enums/segmentation.type';
import {compareAge} from "../../../../shared/validators/compare-age.validator";

@Injectable({
  providedIn: 'root'
})
export class RespondentsService {
  private _respondentRequirements$: BehaviorSubject<RespondentRequirements> =
    new BehaviorSubject<RespondentRequirements>(null);
  private _initialRespondentRequirements: RespondentRequirements = null;
  private _minNumberOfRespondents$: BehaviorSubject<number> =
    new BehaviorSubject<number>(INPUT_MAX_LENGTH);
  private _hasSummError$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _populationCount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(100);
  private _needToCalcTime$: Subject<RespondentRequirements> =
    new Subject<RespondentRequirements>();
  private _needToCalcPrice$: Subject<RespondentRequirements> =
    new Subject<RespondentRequirements>();
  private _isAllSegments$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _form: FormGroup = null;
  private _segmentForm: FormArray = this.fb.array([]);
  private _IRsForm: FormArray = this.fb.array([]);
  private _updateIR$: Subject<boolean> = new Subject<boolean>();
  private _testType = null;

  constructor(
    private appStateService: AppStateService,
    private fb: FormBuilder
  ) {
  }

  public get maxNumberOfRespondents(): number {
    return this._testType === TestType.BIC
      ? MAX_RESP_NUMBER_BIC
      : MAX_NUMBER_OF_RESPONDENTS_PER_COUNTRY_BT;
  }

  public get respondentRequirements$(): Observable<RespondentRequirements> {
    return this._respondentRequirements$;
  }

  public get minNumberOfRespondents$(): Observable<number> {
    return this._minNumberOfRespondents$.asObservable();
  }

  public get hasSummError$(): Observable<boolean> {
    return this._hasSummError$.asObservable();
  }

  public get updateIR$(): Observable<boolean> {
    return this._updateIR$.asObservable();
  }

  public get populationCount$(): Observable<number> {
    return this._populationCount$.asObservable();
  }

  public get isAllSegments$(): Observable<boolean> {
    return this._isAllSegments$.asObservable();
  }


  public get needToCalcTime(): Observable<RespondentRequirements> {
    return this._needToCalcTime$.asObservable();
  }

  public get needToCalcPrice$(): Observable<RespondentRequirements> {
    return this._needToCalcPrice$.asObservable();
  }

  public get initialRespondentRequirements(): RespondentRequirements {
    return this._initialRespondentRequirements;
  }

  public get countryForm(): FormGroup {
    return this._form.controls.countries as FormGroup;
  }

  public get minAgeControl(): FormControl {
    return this._form.controls.minAge as FormControl;
  }

  public get maxAgeControl(): FormControl {
    return this._form.controls.maxAge as FormControl;
  }

  public get genderControl(): FormControl {
    return this._form.controls.genders as FormControl;
  }

  public get segmentTypeControl(): FormControl {
    return this._form.controls.segmentType as FormControl;
  }

  public get segmentControl(): FormControl {
    return this._form.controls.segments as FormControl;
  }

  public get customSegmentControl(): FormControl {
    return this._form.controls.customSegments as FormControl;
  }

  public get numberOfRespondentsControl(): FormControl {
    return (this._form.controls.countries as FormGroup).controls
      .numberOfRespondents as FormControl;
  }

  public get segmentsForm(): FormArray {
    return this._segmentForm;
  }

  public get IRsForm(): FormArray {
    return this._IRsForm;
  }

  public setRespondentRequirements(
    respondentRequirements: RespondentRequirements,
    testType: TestType
  ): RespondentRequirements {
    this._testType = testType;
    this._minNumberOfRespondents$.next(this._getMinRespNumberByTestType());
    if (!respondentRequirements) {
      this._createRespondentRequirements();
    } else {
      this._initialRespondentRequirements = respondentRequirements;
    }
    this._initForm();
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
    return this._initialRespondentRequirements;
  }

  public markControlsAsTouched(): void {
    this._form.controls.minAge.markAsTouched();
    this._form.controls.maxAge.markAsTouched();
    this._form.controls.genders.markAsTouched();
    (
      this._form.controls.countries as FormGroup
    ).controls.country.markAsTouched();
    (
      this._form.controls.countries as FormGroup
    ).controls.subdivisions.markAsTouched();
    (
      this._form.controls.countries as FormGroup
    ).controls.numberOfRespondents.markAsTouched();
  }

  public updateCountry(): void {
    const newCountry = {
      id: (this._form.controls.countries as FormGroup).controls.country.value
        .id,
      value: (this._form.controls.countries as FormGroup).controls.country.value
        .countryName,
      code: (this._form.controls.countries as FormGroup).controls.country.value
        .code
    };
    this._initialRespondentRequirements.countries[0] = {
      ...this._initialRespondentRequirements.countries[0],
      ...newCountry
    };
    if (
      this._initialRespondentRequirements.respondentRequirementSegmentCounts
        .length
    ) {
      this._initialRespondentRequirements.respondentRequirementSegmentCounts.map(
        (country) =>
          (country.countryId =
            this._initialRespondentRequirements.countries[0].id)
      );
      if (this._segmentForm) {
        this._segmentForm.controls.forEach((control) =>
          (control as FormGroup).controls.countryId.setValue(
            this._initialRespondentRequirements.countries[0].id
          )
        );
      }
    }
    if (this._testType === TestType.BT) {
      (
        this._form.controls.countries as FormGroup
      ).controls.numberOfRespondents.setValue(
        MIN_NUMBER_OF_RESPONDENTS_PER_COUNTRY_BT
      );
      this.updateCountryNumberOfRespondents();
    }
    this.updateSubdivisions();
  }

  public updateSubdivisions(): void {
    this._initialRespondentRequirements.subdivisions = (
      this._form.controls.countries as FormGroup
    ).controls.subdivisions.value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
    this._initIRsForm();
  }

  public updateMinAge(): void {
    this._initialRespondentRequirements.minAge =
      this._form.controls.minAge.value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
  }

  public updateMaxAge(): void {
    this._initialRespondentRequirements.maxAge =
      this._form.controls.maxAge.value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
  }

  public updateGenders(): void {
    this._initialRespondentRequirements.genders =
      this._form.controls.genders.value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
  }

  public updateCategoryScreening(value: number): void {
    this._initialRespondentRequirements.categoryScreening = value;
    this._initialRespondentRequirements.categoryScreeningType =
      CategoryScreeningType.All;
    this._initialRespondentRequirements.customCategoryScreens = [];
    this._initialRespondentRequirements.involvements.forEach(
      (involvmet) =>
        (involvmet.purchaseFrequenciesIds = this._getDefaultPurchaseFrequancy())
    );
    this._initialRespondentRequirements.customInvolvements.forEach(
      (involvmet) =>
        (involvmet.purchaseFrequenciesIds = this._getDefaultPurchaseFrequancy())
    );
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateIRs(): void {
    this._initialRespondentRequirements.categoryIRs =
      this._IRsForm.getRawValue();
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._updateIR$.next(true);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
  }

  public updateCountryNumberOfRespondents(): void {
    if (
      (this._form.controls.countries as FormGroup).controls.numberOfRespondents
        .valid
    ) {
      this._initialRespondentRequirements.countries[0].respondentCount = (
        this._form.controls.countries as FormGroup
      ).controls.numberOfRespondents.value;
      this._respondentRequirements$.next(this._initialRespondentRequirements);
    } else {
      if (this._initialRespondentRequirements.countries[0]) {
        this._initialRespondentRequirements.countries[0].respondentCount = 0;
        this._respondentRequirements$.next(this._initialRespondentRequirements);
      }
    }
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
    this._countPopulation();
  }

  public updateCustomSegments(): void {
    this._initialRespondentRequirements.customSegments =
      this._form.controls.customSegments.value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._updateNumberOfRespondentsForCustomSegments();
    this._needToCalcTime$.next(this._initialRespondentRequirements);
    this._needToCalcPrice$.next(this._initialRespondentRequirements);
  }

  public updateSegments(): void {
    const newSegments = this._form.controls.segments.value;
    if (!newSegments.filter((segment) => segment.isDefault)[0]) {
      newSegments.push(this.appStateService.defaultSegment);
    }
    this._initialRespondentRequirements.segments = newSegments;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._updateNumberOfRespondentsForSegments();
    this._needToCalcTime$.next(this._initialRespondentRequirements);
  }

  public updateSegmentType(): void {
    switch (this._form.controls.segmentType.value) {
      case SegmentationTypes.Custom:
        this._setCustomSegmentation();
        break;
      case SegmentationTypes.Predefined:
        this._setPredefinedSegmentation();
        break;
      case SegmentationTypes.NoSegments:
        this._setNoSegments();
    }
    this._countPopulation();
    this._respondentRequirements$.next(this._initialRespondentRequirements);
    this._needToCalcTime$.next(this._initialRespondentRequirements);
  }

  public updateRespondentCountPerSegment(): void {
    this._updateSegmentsForCountries();
    this._initialRespondentRequirements.isCustomSegmentation
      ? this._updateValidityForRespondents(SegmentationTypes.Custom)
      : this._updateValidityForRespondents(SegmentationTypes.Predefined);
    this._countPopulation();
  }

  public updateCustomCategory(value): void {
    this._initialRespondentRequirements.customCategory.categoryName = value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateCategoryDescription(value): void {
    this._initialRespondentRequirements.categoryDescription = value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateCategoryInvolvement(value): void {
    this._initialRespondentRequirements.involvementCategoryId = value;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateInvolvements(value): void {
    const newInvolvments = [];
    value.forEach((item) => {
      if (!item.id.includes('custom')) {
        const itemObj = {
          id: item.id,
          purchaseFrequenciesIds:
            this._initialRespondentRequirements.involvements.find(
              (elem) => elem.id === item.id
            )
              ? this._initialRespondentRequirements.involvements.find(
                (elem) => elem.id === item.id
              ).purchaseFrequenciesIds
              : this._getDefaultPurchaseFrequancy()
        };
        newInvolvments.push(itemObj);
      }
    });
    this._initialRespondentRequirements.involvements = newInvolvments;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateCustomSubcategories(
    subcategoriesValues: { subcategory: string; position: number }[]
  ): void {
    const newCustomSubcategories = [];
    subcategoriesValues.forEach((value, i) => {
      newCustomSubcategories.push({
        value: value.subcategory,
        purchaseFrequenciesIds:
          this._initialRespondentRequirements.customInvolvements.find(
            (elem) => elem.position === value.position
          )?.purchaseFrequenciesIds?.length
            ? this._initialRespondentRequirements.customInvolvements.find(
              (elem) => elem.position === value.position
            )?.purchaseFrequenciesIds
            : this._getDefaultPurchaseFrequancy(),
        position: value.position
      });
    });
    this._initialRespondentRequirements.customInvolvements =
      newCustomSubcategories;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateCategory(category: CategoryInvolvement): void {
    this._initialRespondentRequirements.involvementCategoryId = category.id;
    this._initialRespondentRequirements.involvements = [];
    this._initialRespondentRequirements.customInvolvements = [];
    this._initialRespondentRequirements.customCategory = { categoryName: '' };
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updatePurchaseFrequancies(
    category: Involment,
    purchaseFrequency: string[]
  ): void {
    let involvmentIndex;
    if (category.id) {
      involvmentIndex =
        this._initialRespondentRequirements.involvements.findIndex(
          (item) => item.id === category.id
        );
      if (involvmentIndex !== -1) {
        this._initialRespondentRequirements.involvements[
          involvmentIndex
          ].purchaseFrequenciesIds = purchaseFrequency;
      } else {
        involvmentIndex =
          this._initialRespondentRequirements.customInvolvements.findIndex(
            (item) => item.id === category.id
          );
        this._initialRespondentRequirements.customInvolvements[
          involvmentIndex
          ].purchaseFrequenciesIds = purchaseFrequency;
      }
    } else {
      involvmentIndex =
        this._initialRespondentRequirements.customInvolvements.findIndex(
          (item) => item.value === category.value
        );
      this._initialRespondentRequirements.customInvolvements[
        involvmentIndex
        ].purchaseFrequenciesIds = purchaseFrequency;
    }
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateCategoryScreeningType(type: CategoryScreeningType): void {
    this._initialRespondentRequirements.categoryScreeningType = type;
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public deleteCustomScreeningQuestion(num: number): void {
    this._initialRespondentRequirements.customCategoryScreens.splice(num, 1);
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public updateCustomScreeningQuestions(
    question: CustomQuestionsScreening
  ): void {
    this._initialRespondentRequirements.customCategoryScreens.push(question);
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public checkCategoryIr(): void {
    this._initialRespondentRequirements.categoryIRs =
      this._initialRespondentRequirements.categoryIRs.map((val) => {
        val.ir = val.ir > MAX_IR ? 0 : val.ir;
        return val;
      });
    this._respondentRequirements$.next(this._initialRespondentRequirements);
  }

  public setPopulation(): void {
    if (
      (this._initialRespondentRequirements.isSegmentation ||
        this._initialRespondentRequirements.isCustomSegmentation) &&
      !this._initialRespondentRequirements.allSegments
    ) {
      this._initialRespondentRequirements.countries[0].populationCount =
        this._populationCount$.getValue();
    } else {
      this._initialRespondentRequirements.countries[0].populationCount =
        this._initialRespondentRequirements.countries[0]?.respondentCount || 0;
    }
  }

  private _createRespondentRequirements(): void {
    this._initialRespondentRequirements =
      TestCreationUtils.createNewRespondentRequirements(
        this.appStateService.respondentOptions$.getValue()
      );
  }

  private _initForm(): void {
    this._form = this.fb.group(
      {
        minAge: [
          this._initialRespondentRequirements.minAge,
          [
            Validators.required,
            Validators.max(MAX_MIN_AGE),
            Validators.min(MIN_AGE)
          ]
        ],
        maxAge: [
          this._initialRespondentRequirements.maxAge,
          [
            Validators.required,
            Validators.max(MAX_AGE),
            Validators.min(MIN_MAX_AGE)
          ]
        ],
        genders: [
          this._getTranslatedGenders(
            this._initialRespondentRequirements.genders
          ),
          Validators.required
        ],
        purchaseFrequencies: [],
        segments: [this._initialRespondentRequirements.segments],
        customSegments: [this._initialRespondentRequirements.customSegments],
        segmentType: [SEGMENT_TYPES[2]],
        countries: this.fb.group({
          country: [null, Validators.required],
          subdivisions: [[], Validators.required],
          numberOfRespondents: [
            null,
            [
              Validators.required,
              Validators.min(this._getMinRespNumberByTestType()),
              Validators.max(this.maxNumberOfRespondents),
              CustomValidator.isIntegerValidator
            ]
          ],
          populationCount: null,
          respondentRequirementSegmentCounts: []
        })
      },
      {
        validators: [compareAge('minAge', 'maxAge')]
      }
    );
    if (this._initialRespondentRequirements.countries.length) {
      this._setCountryToForm();
    }
    if (this._initialRespondentRequirements.isSegmentation) {
      this._form.controls.segmentType.setValue(SEGMENT_TYPES[1]);
    }
    if (this._initialRespondentRequirements.isCustomSegmentation) {
      this._form.controls.segmentType.setValue(SEGMENT_TYPES[0]);
    }
    if (
      !this._initialRespondentRequirements.isSegmentation &&
      !this._initialRespondentRequirements.isCustomSegmentation
    ) {
      this._form.controls.segmentType.setValue(SEGMENT_TYPES[2]);
    }
    this.updateSegmentType();
    this._initIRsForm();
  }

  private _setCountryToForm(): void {
    this.countryForm.patchValue({
      country: this.appStateService.countries
        .getValue()
        .find(
          (country) =>
            country.id === this._initialRespondentRequirements.countries[0].id
        ),
      subdivisions: this._initialRespondentRequirements.subdivisions,
      numberOfRespondents:
      this._initialRespondentRequirements.countries[0].respondentCount,
      populationCount:
      this._initialRespondentRequirements.countries[0].populationCount,
      respondentRequirementSegmentCounts:
      this._initialRespondentRequirements.respondentRequirementSegmentCounts
    });
  }

  private _setCustomSegmentation(): void {
    this._initialRespondentRequirements.customSegments?.length
      ? this._form.controls.customSegments.setValue(
        this._initialRespondentRequirements.customSegments
      )
      : this._form.controls.customSegments.setValue(
        this.appStateService.customSegments
      );
    this._initialRespondentRequirements.customSegments =
      this._form.controls.customSegments.value;
    this._initialRespondentRequirements.isCustomSegmentation = true;
    this._initialRespondentRequirements.isSegmentation = false;
    this._updateNumberOfRespondentsForCustomSegments();
  }

  private _setPredefinedSegmentation(): void {
    this._initialRespondentRequirements.segments.length > 1
      ? this._form.controls.segments.setValue(
        this._initialRespondentRequirements.segments
      )
      : this._form.controls.segments.setValue(
        this.appStateService.respondentOptions$.getValue().segments
      );
    this._initialRespondentRequirements.segments =
      this._form.controls.segments.value;
    this._initialRespondentRequirements.isCustomSegmentation = false;
    this._initialRespondentRequirements.isSegmentation = true;
    this._updateNumberOfRespondentsForSegments();
  }

  private _setNoSegments(): void {
    this._initialRespondentRequirements.isCustomSegmentation = false;
    this._initialRespondentRequirements.isSegmentation = false;
    this._initialRespondentRequirements.allSegments = false;
    if (!this._initialRespondentRequirements.segments.length) {
      this._initialRespondentRequirements.segments = [
        this.appStateService.defaultSegment
      ];
    }
    (
      this._form.controls.countries as FormGroup
    ).controls.numberOfRespondents.setValidators([
      Validators.required,
      Validators.min(this._getMinRespNumberByTestType()),
      Validators.max(this.maxNumberOfRespondents),
      CustomValidator.isIntegerValidator
    ]);
    (
      this._form.controls.countries as FormGroup
    ).controls.numberOfRespondents.updateValueAndValidity();
    this._minNumberOfRespondents$.next(this._getMinRespNumberByTestType());
    this._clearSegmentFormArrays();
    this.updateCountryNumberOfRespondents();
  }

  private _updateNumberOfRespondentsForCustomSegments(): void {
    let newValidations;
    if (
      this._initialRespondentRequirements.customSegments.length ===
      this.appStateService.customSegments?.length
    ) {
      newValidations = [
        Validators.required,
        Validators.min(this._getMinRespNumberByTestType()),
        Validators.max(this.maxNumberOfRespondents),
        CustomValidator.isIntegerValidator
      ];
      this._clearSegmentFormArrays();
      this._isAllSegments$.next(true);
      this._initialRespondentRequirements.allSegments = true;
      this._minNumberOfRespondents$.next(this._getMinRespNumberByTestType());
      (
        this._form.controls.countries as FormGroup
      ).controls.numberOfRespondents.setValidators(newValidations);
      (
        this._form.controls.countries as FormGroup
      ).controls.numberOfRespondents.updateValueAndValidity();
      this.updateCountryNumberOfRespondents();
    } else {
      this._initialRespondentRequirements.allSegments = false;
      this._isAllSegments$.next(false);
      this._updateValidityForRespondents(SegmentationTypes.Custom);
      this._initSegmentsForm(SegmentationTypesWithoutNot.Custom);
    }
  }

  private _updateNumberOfRespondentsForSegments(): void {
    let newValidations;
    if (
      this._initialRespondentRequirements.segments.length ===
      this.appStateService.numberOfSegments
    ) {
      newValidations = [
        Validators.required,
        Validators.min(this._getMinRespNumberByTestType()),
        Validators.max(this.maxNumberOfRespondents),
        CustomValidator.isIntegerValidator
      ];
      this._clearSegmentFormArrays();
      this._initialRespondentRequirements.allSegments = true;
      this._isAllSegments$.next(true);
      this._minNumberOfRespondents$.next(this._getMinRespNumberByTestType());
      (
        this._form.controls.countries as FormGroup
      ).controls.numberOfRespondents.setValidators(newValidations);
      (
        this._form.controls.countries as FormGroup
      ).controls.numberOfRespondents.updateValueAndValidity();
      this.updateCountryNumberOfRespondents();
    } else {
      this._initialRespondentRequirements.allSegments = false;
      this._isAllSegments$.next(false);
      this._updateValidityForRespondents(SegmentationTypes.Predefined);
      this._initSegmentsForm(SegmentationTypesWithoutNot.Predefined);
    }
  }

  private _updateValidityForRespondents(type: SegmentationTypes): void {
    const minValue =
      type === SegmentationTypes.Predefined
        ? this._getMinRespondentValue()
        : this._getMinCustomRespondentValue();
    const newValidations = [
      Validators.required,
      Validators.min(minValue),
      Validators.max(MAX_RESP_NUMBER_BIC),
      CustomValidator.isIntegerValidator
    ];
    this._minNumberOfRespondents$.next(minValue);
    (
      this._form.controls.countries as FormGroup
    ).controls.numberOfRespondents.setValidators(newValidations);
    (
      this._form.controls.countries as FormGroup
    ).controls.numberOfRespondents.updateValueAndValidity();
    this.updateCountryNumberOfRespondents();
  }

  private _initSegmentsForm(type: SegmentationTypesWithoutNot): void {
    this._clearSegmentFormArrays();
    const segments =
      type === SegmentationTypesWithoutNot.Predefined
        ? this._initialRespondentRequirements.segments
        : this._initialRespondentRequirements.customSegments;
    segments.forEach((segment) => {
      if (!segment.isDefault) {
        this._segmentForm.push(
          this.fb.group({
            name: segment.value,
            respondentCount: [
              this._getRespondentPerSegmentCount(segment.id) ||
              this._getRespondentPerSegmentCount(segment.id) === 0
                ? this._getRespondentPerSegmentCount(segment.id)
                : 100,
              [
                Validators.required,
                Validators.min(MIN_RESP_NUMBER_PER_SEGMENT)
              ]
            ],
            segmentId: segment.id,
            countryId: this._initialRespondentRequirements.countries[0].id
          })
        );
      }
    });
    this._countPopulation();
    this._updateSegmentsForCountries();
  }

  private _initIRsForm(): void {
    this._IRsForm = this.fb.array([]);
    this._initialRespondentRequirements.countries.forEach((country) => {
      const control = this.fb.group({
        countryId: country.id,
        ir: [
          this._testType === TestType.BT ? 75 : this._initialRespondentRequirements.categoryIRs.length &&
          this._initialRespondentRequirements.categoryIRs.find(
            (ir) => ir.countryId === country.id
          )
            ? this._initialRespondentRequirements.categoryIRs.find(
              (ir) => ir.countryId === country.id
            ).ir
            : 0
          ,
          [Validators.required, Validators.min(MIN_IR), Validators.max(MAX_IR)]
        ]
      });
      this._IRsForm.push(control);
    });
    this.updateIRs();
  }

  private _clearSegmentFormArrays(): void {
    this._segmentForm = this.fb.array([]);
  }

  private _getRespondentPerSegmentCount(segmentId: string): number {
    return this._initialRespondentRequirements.respondentRequirementSegmentCounts.find(
      (element) =>
        element.countryId ===
        this._initialRespondentRequirements.countries[0].id &&
        element.segmentId === segmentId
    )?.respondentCount;
  }

  private _updateSegmentsForCountries(): void {
    this._initialRespondentRequirements.respondentRequirementSegmentCounts = [];
    this._initialRespondentRequirements.respondentRequirementSegmentCounts.push(
      ...this._segmentForm.getRawValue()
    );
  }

  private _getMinRespondentValue(): number {
    let num = TestCreationUtils.getMinRespondentValue(
      this._initialRespondentRequirements
    );
    if (num > MAX_RESP_NUMBER_BIC) {
      this._hasSummError$.next(true);
      num = MAX_RESP_NUMBER_BIC;
    } else {
      this._hasSummError$.next(false);
    }
    return num;
  }

  private _getMinCustomRespondentValue(): number {
    let num = TestCreationUtils.getMinCustomRespondentValue(
      this._initialRespondentRequirements
    );
    if (num > MAX_RESP_NUMBER_BIC) {
      this._hasSummError$.next(true);
      num = MAX_RESP_NUMBER_BIC;
    } else {
      this._hasSummError$.next(false);
    }
    return num;
  }

  private _countPopulation(): void {
    if (this._initialRespondentRequirements.countries.length) {
      this._populationCount$.next(
        this._initialRespondentRequirements.countries[0].respondentCount -
        TestCreationUtils.getNumberPerSegment(this._segmentForm) >
        99
          ? this._initialRespondentRequirements.countries[0].respondentCount -
          TestCreationUtils.getNumberPerSegment(this._segmentForm)
          : 100
      );
    }
  }

  private _getDefaultPurchaseFrequancy(): string[] {
    return this.appStateService.respondentOptions$
      .getValue()
      .purchaseFrequencies.slice(0, 2)
      .map((item) => item.id);
  }

  private _getTranslatedGenders(genders: ListItem[]): ListItem[] {
    return this.appStateService.respondentOptions$
      .getValue()
      .genders.filter((item) =>
        genders.map((elem) => elem.id).includes(item.id)
      );
  }

  private _getMinRespNumberByTestType(): number {
    return this._testType === TestType.BIC
      ? INPUT_MAX_LENGTH
      : MIN_NUMBER_OF_RESPONDENTS_PER_COUNTRY_BT;
  }
}
