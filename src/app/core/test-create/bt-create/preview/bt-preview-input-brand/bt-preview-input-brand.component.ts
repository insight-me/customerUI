import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ARRAY_NUMBERS } from '../../../../../../assets/consts/consts';
import { BicCategoryService } from '../../../../../shared/services/bic-test/bic-category.service';
import { SubCategoryInvolvement } from './../../../../../shared/models/bt-test.model';
import { CustomTranslateService } from './../../../../../shared/services/custom-translate.service';

@Component({
  selector: 'app-bt-preview-input-brand',
  templateUrl: './bt-preview-input-brand.component.html',
  styleUrls: ['./bt-preview-input-brand.component.scss']
})
export class BtPreviewInputBrandComponent {
  public previewBlock = ARRAY_NUMBERS;

  public get selectedSubCategories(): SubCategoryInvolvement[] {
    return this.categoryService.subcategoriesControl.value;
  }

  public get customSubcategoriesControl(): Record<string, any>[] {
    return this.categoryService.customSubcategoriesControl.value;
  }

  public get selectedSubCategories$(): Observable<string> {
    return this._customTranslateService.translatedSubcategories$
      .pipe(
        map((res) => this._getTranslatedSubCategories(res)),
        shareReplay()
      );
  }

  constructor(public categoryService: BicCategoryService, private _customTranslateService: CustomTranslateService) { }

  private _getTranslatedSubCategories(res: SubCategoryInvolvement[]): string {
    const selectedIds = new Set(this.selectedSubCategories.map(item => item.id));

    const translatedSubcategories = res
      .filter(v => selectedIds.has(v.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => item.name);

    const customSubCategories = this.customSubcategoriesControl
      .sort((a, b) => a.subcategory.localeCompare(b.subcategory))
      .map(item => item.subcategory);

    const subCategories = [...translatedSubcategories, ...customSubCategories]
      .sort((a, b) => a.localeCompare(b))
      .join(', ');

    return subCategories || this._customTranslateService.translations.preview.SELECT_PRODUCT_SUBCATEGORIES;
  }
}
