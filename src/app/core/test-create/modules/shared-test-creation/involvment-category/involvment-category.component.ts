import { TranslateService } from '@ngx-translate/core';
import { RespondentsService } from 'src/app/core/test-create/bic-create/services/respondents.service';
import { DropdownDataType } from 'src/app/shared/enums/dropdown.type';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { CategoryInvolvement, SubCategoryInvolvement } from '../../../../../shared/models/bt-test.model';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-involvment-category',
  templateUrl: './involvment-category.component.html',
  styleUrls: ['./involvment-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvolvmentCategoryComponent {
  constructor(
    public categoryService: BicCategoryService,
    private translate: TranslateService,
    private bicRespondentsService: RespondentsService,
    private cdr: ChangeDetectorRef
  ) {}

  public get showCategoryDropdownError(): boolean {
    return (
      this.categoryService.categoryControl.touched &&
      (this.categoryService.categoryControl.errors?.required || !this.categoryService.categoryControl.value?.id)
    );
  }

  public get showCustomCategoryInputError(): boolean {
    return this.categoryService.customCategoryControl.touched && this.categoryService.customCategoryControl.invalid;
  }

  public get DropdownDataType(): typeof DropdownDataType {
    return DropdownDataType;
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public getErrorMessage(control: FormControl): string {
    if (control.errors.pattern) {
      return 'BIC.Subcategory can not be empty';
    }
    if (control.errors.checkExist) {
      return 'BIC.Subcategory exists';
    }
    if (control.errors.minlength || control.errors.maxlength || control.errors.required) {
      return 'BIC.Product category is required and must be between 2 and 30 symbols long';
    }
  }

  public selectCategory(item): void {
    this.categoryService.updateCategory(item);
    this.bicRespondentsService.updateCategoryInvolvement(this.categoryService.categoryControl.value.id);
    this.bicRespondentsService.updateInvolvements([]);
    this.cdr.detectChanges();
  }

  public updateDescription(): void {
    this.categoryService.categoryDescriptionControl.setValue(this.categoryService.categoryDescriptionControl.value.trim());
    this.bicRespondentsService.updateCategoryDescription(this.categoryService.categoryDescriptionControl.value);
  }

  public updateCustomCategory(): void {
    this.categoryService.customCategoryControl.setValue(this.categoryService.customCategoryControl.value.trim());
    this.bicRespondentsService.updateCustomCategory(this.categoryService.customCategoryControl.value);
  }

  public selectSubCategory(item): void {
    this.categoryService.updateSubcategory(item);
    this.cdr.detectChanges();
  }

  public markAsTouchedForm(type: string): void {
    if (type === 'category') {
      this.categoryService.markAsTouchedCategory();
    } else {
      this.categoryService.markAsTouchedSubCategory();
    }
  }

  public onSaveCustomSubcategory(control: FormControl): void {
    control.setValue(control.value.trim());
    this.categoryService.updateSubcategoriesNames();
    this.bicRespondentsService.updateCustomSubcategories(
      (this.categoryService.categoryForm.controls.customSubcategories as FormArray).getRawValue()
    );
    this.cdr.detectChanges();
  }

  public getDescriptionLabel(subcategories: string[]): string {
    if (subcategories.length) {
      return (
        this.translate.instant('BIC.Please describe what you mean with') +
        this._getStringWithCommasAndAnd(orderBy(subcategories, name => name.toLowerCase()))
      );
    } else {
      return 'BIC.Please describe what you mean';
    }
  }

  public isExistCategoryName(categories: CategoryInvolvement[]): boolean {
    return categories
      .map(category => category.name.toLowerCase())
      .includes(this.categoryService.customCategoryControl.value.toLowerCase().trim());
  }

  public isExistSubCategoryName(control: FormControl, subCategories: SubCategoryInvolvement[]): boolean {
    return subCategories.map(category => category.name.toLowerCase()).includes(control.value.toLowerCase().trim());
  }

  private _getStringWithCommasAndAnd(subcategories: string[]): string {
    return subcategories.length > 1
      ? `${subcategories.slice(0, -1).join(', ')} ${this.translate.instant('BIC.and')} ${subcategories.slice(-1)}`
      : subcategories[0];
  }
}
