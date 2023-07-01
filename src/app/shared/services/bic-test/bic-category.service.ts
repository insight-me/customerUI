import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NO_ORDER_ID, NO_SPACE_PATTERN } from '../../../../assets/consts/consts';
import {
  MAX_CATEGORY_DESCRIPTION,
  MAX_CUSTOM_CATEGORY_LENGTH,
  MIN_CUSTOM_CATEGORY_LENGTH
} from '../../../../assets/consts/test-creation.const';
import { RespondentsService } from '../../../core/test-create/bic-create/services/respondents.service';
import { CategoryInvolvement, SubCategoryInvolvement } from '../../models/bt-test.model';
import { RespondentRequirements } from '../../models/test.model';
import { TestCreationUtils } from '../../utils/test.creation.utils';
import { checkExist } from '../../validators/check-exist.validator';
import { AppStateService } from '../app-state/app-state.service';
import { BtTestService } from '../bt-test/bt-test.service';

const OTHER_CATEGORY_ID = '60820504-872d-4b20-8dda-c607067e2ee6';

@Injectable({
  providedIn: 'root',
})
export class BicCategoryService {
  public categoryForm: FormGroup = this.fb.group({});
  public selectedSubcategoriesNames$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private _isOtherCategory$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _categories$: BehaviorSubject<CategoryInvolvement[]> = new BehaviorSubject<CategoryInvolvement[]>([]);
  private _subcategories$: BehaviorSubject<SubCategoryInvolvement[]> = new BehaviorSubject<SubCategoryInvolvement[]>([]);
  private _selectedCategory$: BehaviorSubject<CategoryInvolvement> = new BehaviorSubject<CategoryInvolvement>(null);
  private _categories: CategoryInvolvement[] = [];
  private _selectedCategory: CategoryInvolvement;
  private _subcategories: SubCategoryInvolvement[] = [];
  private _initialRespRequirements = null;
  private _lang = 'EN';
  private _otherSubcategories = [
    {
      name: 'Other option',
      id: 'custom 1',
      position: 1,
    },
    {
      name: 'Other option',
      id: 'custom 2',
      position: 2,
    },
    {
      name: 'Other option',
      id: 'custom 3',
      position: 3,
    },
    {
      name: 'Other option',
      id: 'custom 4',
      position: 4,
    },
  ];

  constructor(
    private btTestService: BtTestService,
    private fb: FormBuilder,
    private appStateService: AppStateService,
    private bicRespondentsService: RespondentsService
  ) {
    this._initForm();
  }

  public get categoryControl(): FormControl {
    return this.categoryForm.controls.category as FormControl;
  }

  public get subcategoriesControl(): FormControl {
    return this.categoryForm.controls.subcategories as FormControl;
  }

  public get customSubcategoriesControl(): FormArray {
    return this.categoryForm.controls.customSubcategories as FormArray;
  }

  public get customCategoryControl(): FormControl {
    return this.categoryForm.controls.customCategory as FormControl;
  }

  public get isCustomCategoryControl(): FormControl {
    return this.categoryForm.controls.isCustomCategory as FormControl;
  }

  public get isCustomSubcategoryControl(): FormControl {
    return this.categoryForm.controls.isCustomSubcategory as FormControl;
  }

  public get categoryDescriptionControl(): FormControl {
    return this.categoryForm.controls.categoryDescription as FormControl;
  }

  public get categories$(): Observable<CategoryInvolvement[]> {
    return this._categories$;
  }

  public get subcategories(): SubCategoryInvolvement[] {
    return this._subcategories;
  }

  public get subcategories$(): Observable<SubCategoryInvolvement[]> {
    return this._subcategories$;
  }

  public get selectedCategory$(): Observable<CategoryInvolvement> {
    return this._selectedCategory$.asObservable();
  }

  public get selectedCategory(): CategoryInvolvement {
    return this._selectedCategory;
  }

  public get isOtherCategory$(): Observable<boolean> {
    return this._isOtherCategory$.asObservable();
  }

  public get categoryName(): string {
    return this.isCustomCategoryControl.value ? this.customCategoryControl.value : this.categoryControl.value.name;
  }

  public get isCustomSubcategoryControlValid(): boolean {
    let valid = true;
    this.customSubcategoriesControl.controls.forEach(control => {
      if ((control as FormGroup).controls.subcategory.invalid) {
        valid = false;
      }
    });
    return valid;
  }

  public setCategoryWhenInitTest(respondentRequirements: RespondentRequirements): void {
    this.categoryForm.controls.category.markAsUntouched();
    this.categoryForm.controls.subcategories.markAsUntouched();
    this._initialRespRequirements = respondentRequirements;
    this._resetCategoryData();
    this._getRespondentRequirements();
    if (!this._categories.length || this._lang !== this.appStateService.language.getValue()) {
      this._getAllCategories();
      this._lang = this.appStateService.language.getValue();
    } else {
      this._setTestCategory();
    }
  }

  public updateCategory(category: CategoryInvolvement): void {
    this.categoryControl.setValue(category);
    this.isCustomCategoryControl.setValue(category.id === OTHER_CATEGORY_ID);
    this._isOtherCategory$.next(category.id === OTHER_CATEGORY_ID);
    if (category.id !== OTHER_CATEGORY_ID) {
      this._selectedCategory$.next(category);
    } else {
      this._selectedCategory$.next(null);
    }
    this.isCustomSubcategoryControl.setValue(false);
    this._setCustomCategoryFormValidators(this.isCustomCategoryControl.value);
    this.subcategoriesControl.setValue([]);
    this.categoryForm.controls.customSubcategories = this.fb.array([]);
    this.customCategoryControl.setValue('');
    this.bicRespondentsService.updateCategory(category);
    this.updateSubcategoriesNames();
    this._getAllSubcategories();
  }

  public updateSubcategory(subcategory: SubCategoryInvolvement[]): void {
    this.subcategoriesControl.setValue(subcategory);
    this.bicRespondentsService.updateInvolvements(subcategory.filter(item => !item.id.includes('custom')));
    this.categoryForm.controls.customSubcategories = this.fb.array([]);
    const otherSub = subcategory.filter(item => item.id.includes('custom'));
    otherSub.length &&
      otherSub.forEach((item, i) => {
        (this.categoryForm.controls.customSubcategories as FormArray).push(
          this.fb.group({
            subcategory: [
              this._initialRespRequirements.customInvolvements.find(inv => inv.position === item.position)
                ? this._initialRespRequirements.customInvolvements.find(inv => inv.position === item.position).value
                : '',
              [
                Validators.required,
                Validators.minLength(MIN_CUSTOM_CATEGORY_LENGTH),
                Validators.maxLength(MAX_CUSTOM_CATEGORY_LENGTH),
                Validators.pattern(NO_SPACE_PATTERN),
              ],
            ],
            position: item.position,
          })
        );
      });
    this._markAsTouchedCustomFields();
    this.updateSubcategoriesNames();
    this.bicRespondentsService.updateCustomSubcategories((this.categoryForm.controls.customSubcategories as FormArray).getRawValue());
  }

  public markAsTouchedCustomSubcategoriesControl(): void {
    if (this.customSubcategoriesControl.controls.length) {
      this._markAsTouchedCustomFields();
    }
  }

  public markAsTouchedCategory(): void {
    this.categoryForm.controls.category.markAsTouched();
  }

  public markAsTouchedSubCategory(): void {
    this.categoryForm.controls.subcategories.markAsTouched();
  }

  private _initForm(): void {
    this.categoryForm = this.fb.group({
      category: [NO_ORDER_ID, [Validators.required]],
      subcategories: [[], [Validators.required]],
      customSubcategories: this.fb.array([]),
      customCategory: [''],
      isCustomCategory: false,
      isCustomSubcategory: false,
      categoryDescription: [null, [Validators.maxLength(MAX_CATEGORY_DESCRIPTION)]],
    });
  }

  public updateSubcategoriesNames(): void {
    this._updateCustomSubcategoriesValidation();
    this.selectedSubcategoriesNames$.next(
      this._subcategories
        .filter(subcategory => this._initialRespRequirements.involvements.map(item => item.id).includes(subcategory.id))
        .map(item => item.name)
        .concat(
          TestCreationUtils.getValuesNotInvalid(this.customSubcategoriesControl)
            .map(value => value.subcategory)
            .filter(value => value)
        )
    );
  }

  private _updateCustomSubcategoriesValidation(): void {
    const allValues = this._subcategories
      .filter(subcategory => this._initialRespRequirements.involvements.map(item => item.id).includes(subcategory.id))
      .map(item => item.name)
      .concat(
        this.customSubcategoriesControl
          .getRawValue()
          .map(elem => elem.subcategory)
          .filter(value => value)
      );
    this.customSubcategoriesControl.controls.forEach(control => {
      const valuesForValidation = [...allValues];
      const currentControlValueIndex = allValues.findIndex(item => item === (control as FormGroup).controls.subcategory.value);
      if (currentControlValueIndex !== -1) {
        valuesForValidation.splice(currentControlValueIndex, 1);
      }
      (control as FormGroup).controls.subcategory.setValidators([
        Validators.required,
        Validators.minLength(MIN_CUSTOM_CATEGORY_LENGTH),
        Validators.maxLength(MAX_CUSTOM_CATEGORY_LENGTH),
        Validators.pattern(NO_SPACE_PATTERN),
        checkExist(valuesForValidation),
      ]);
      (control as FormGroup).controls.subcategory.markAsTouched();
      (control as FormGroup).controls.subcategory.updateValueAndValidity();
    });
  }

  private _getAllCategories(): void {
    this.btTestService.getInvolvementCategory().subscribe({
      next: categories => {
        this._categories = categories;
        this._categories$.next(categories);
        if (this._initialRespRequirements) {
          this._setTestCategory();
        }
      },
    });
  }

  private _getAllSubcategories(): void {
    this.btTestService.getInvolvement(this.categoryControl.value.id).subscribe({
      next: subcategories => {
        this._subcategories = subcategories;
        this._subcategories.push(...this._otherSubcategories);
        this._subcategories$.next(subcategories);
      },
    });
  }

  private _setTestCategory(): void {
    this.categoryForm.controls.categoryDescription.setValue(this._initialRespRequirements.categoryDescription);
    const selectedCategory = this._categories.find(category => category.id === this._initialRespRequirements.involvementCategoryId);
    if (selectedCategory) {
      this.categoryControl.setValue(selectedCategory);
      this._selectedCategory$.next(selectedCategory);
      this._selectedCategory = selectedCategory;

      this.isCustomCategoryControl.setValue(selectedCategory.id === OTHER_CATEGORY_ID);
      this._isOtherCategory$.next(selectedCategory.id === OTHER_CATEGORY_ID);
      this.customCategoryControl.setValue(
        this.isCustomCategoryControl.value ? this._initialRespRequirements.customCategory.categoryName : ''
      );
      this._setCustomCategoryFormValidators(this.isCustomCategoryControl.value);
      this._setTestSubcategory();
    }
  }

  private _setTestSubcategory(): void {
    this.btTestService.getInvolvement(this.categoryControl.value.id).subscribe({
      next: subcategories => {
        this._subcategories = subcategories;
        this._subcategories.push(...this._otherSubcategories);
        this._subcategories$.next(subcategories);
        const selectedSubcategories = [];
        if (this._initialRespRequirements.involvements.length) {
          selectedSubcategories.push(
            ...this._subcategories.filter(subcategory =>
              this._initialRespRequirements.involvements.map(item => item.id).includes(subcategory.id)
            )
          );
        }
        if (this._initialRespRequirements.customInvolvements.length) {
          this._otherSubcategories.forEach(elem => {
            if (this._initialRespRequirements.customInvolvements.map(item => item.position).includes(elem.position)) {
              selectedSubcategories.push(elem);
            }
          });
        }
        this._initialRespRequirements.customInvolvements.forEach((item, i) => {
          (this.categoryForm.controls.customSubcategories as FormArray).push(
            this.fb.group({
              subcategory: [
                this._initialRespRequirements.customInvolvements[i]?.value,
                [Validators.required, Validators.minLength(MIN_CUSTOM_CATEGORY_LENGTH), Validators.maxLength(MAX_CUSTOM_CATEGORY_LENGTH)],
              ],
              position: item.position,
            })
          );
        });
        this._markAsTouchedCustomFields();
        this.updateSubcategoriesNames();
        this.subcategoriesControl.setValue(selectedSubcategories);
      },
    });
  }

  private _setCustomCategoryFormValidators(isCustomControl: boolean): void {
    this.customCategoryControl.setValidators(
      isCustomControl
        ? [
          Validators.required,
          Validators.minLength(MIN_CUSTOM_CATEGORY_LENGTH),
          Validators.maxLength(MAX_CUSTOM_CATEGORY_LENGTH),
          Validators.pattern(NO_SPACE_PATTERN),
          checkExist(this._initialRespRequirements.customInvolvements.map(item => item.value)),
        ]
        : []
    );
    this.customCategoryControl.updateValueAndValidity();
  }

  private _getRespondentRequirements(): void {
    this.bicRespondentsService.respondentRequirements$.subscribe({
      next: respondentRequirements => (this._initialRespRequirements = respondentRequirements),
    });
  }

  private _markAsTouchedCustomFields(): void {
    this.customSubcategoriesControl.controls.forEach(control => control.markAsTouched());
  }

  private _resetCategoryData(): void {
    this.selectedSubcategoriesNames$.next([]);
    this._selectedCategory$.next(null);
    this._subcategories = [];
    this._subcategories$.next([]);
    this._isOtherCategory$.next(false);
    this.categoryForm.patchValue({
      categoryDescription: null,
      isCustomSubcategory: false,
      isCustomCategory: false,
      customCategory: '',
      subcategories: [],
      category: NO_ORDER_ID,
    });
    this.categoryForm.controls.customSubcategories = this.fb.array([]);
    this.categoryForm.updateValueAndValidity();
  }

  public isSelectedProductName(): string {
    const categoryControlOtherValue = this.categoryControl.value.name === 'Other';
    const otherCategoryNameFieldValue = this.customCategoryControl.value;
    const categoryControlName = this.categoryControl.value.name;
    const isNameFieldFilledWhenOtherCategoryChosen = categoryControlOtherValue && otherCategoryNameFieldValue;

    return isNameFieldFilledWhenOtherCategoryChosen
      ? otherCategoryNameFieldValue
      : categoryControlOtherValue && !otherCategoryNameFieldValue
        ? `<SELECTED PRODUCT CATEGORY>`
        : !categoryControlName
          ? `<SELECTED PRODUCT CATEGORY>`
          : categoryControlName;
  }
}
