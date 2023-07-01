import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { RespondentsService } from 'src/app/core/test-create/bic-create/services/respondents.service';
import { CategoryInvolvement, SubCategoryInvolvement } from '../models/bt-test.model';
import { RespondentOptions } from '../models/test-creation.model';
import { RespondentRequirements } from '../models/test.model';
import { Association } from './../models/test.model';
import { BicCategoryService } from './bic-test/bic-category.service';
import { BtTestService } from './bt-test/bt-test.service';

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {
  public translatedRespondentOptions$: BehaviorSubject<RespondentOptions> = new BehaviorSubject(null);
  public translatedSubcategories: SubCategoryInvolvement[] = [];
  public translatedCategories: CategoryInvolvement[] = [];
  public translatedSubcategories$: BehaviorSubject<SubCategoryInvolvement[]> =
    new BehaviorSubject<SubCategoryInvolvement[]>([]);
  public translatedCategories$: BehaviorSubject<CategoryInvolvement[]> =
    new BehaviorSubject<CategoryInvolvement[]>([]);
  public translatedRespondentRequirements$: BehaviorSubject<RespondentRequirements> =
    new BehaviorSubject<RespondentRequirements>(null);
  public translationsLoaded$ = new Subject()
  public translatedAssociations: Association[] = [];
  public translatedTestAssociations: Association[] = [];
  public otherSubcategories = [
    {
      name: 'Other option',
      id: 'custom 1',
      position: 1
    },
    {
      name: 'Other option',
      id: 'custom 2',
      position: 2
    },
    {
      name: 'Other option',
      id: 'custom 3',
      position: 3
    },
    {
      name: 'Other option',
      id: 'custom 4',
      position: 4
    }
  ];
  public translations: Record<string, any> | null;

  get customSubcategoriesControl(): Record<string, any>[] {
    return this._bicCategoryService.customSubcategoriesControl.value;
  }


  // tslint:disable-next-line: max-line-length
  constructor(
    private _bicCategoryService: BicCategoryService,
    private _btTestService: BtTestService,
    private _translateService: TranslateService,
    private _respondentService: RespondentsService,
  ) { }

  public updateInvolvementCategoryTranslate(lang: string): Observable<(CategoryInvolvement[] | SubCategoryInvolvement[])[]> {
    const streams$: Observable<(CategoryInvolvement[] | SubCategoryInvolvement[])>[] = [];

    streams$.push(this._btTestService.getInvolvementCategory(lang).pipe(tap((res: CategoryInvolvement[]) => {
      this.translatedCategories = res;
      this.translatedCategories$.next(res);
    })));


    if (this._bicCategoryService.categoryControl.value.id) {
      // tslint:disable-next-line: max-line-length
      streams$.push(this._btTestService.getInvolvement(this._bicCategoryService.categoryControl.value.id, lang).pipe(tap((subcategories: SubCategoryInvolvement[]) => {
        this.translatedSubcategories = subcategories;
        // this.translatedSubcategories.push(...this.otherSubcategories);
        this.translatedSubcategories$.next(subcategories);
        this.setTranslatedRespondentRequirements(subcategories);
      })));
    }

    return forkJoin(streams$).pipe(finalize(() => this.translationsLoaded$.next(true)));
  }

  public setTranslatedRespondentRequirements(subcategories: SubCategoryInvolvement[]): void {
    const respondentRequirements = cloneDeep(this._respondentService.initialRespondentRequirements);
    const matchResult = [];

    respondentRequirements.involvements.map((item, i) => {
      const match = subcategories.find((involve) => involve.id === item.id);
      if (match) {
        item.value = match.name;
        matchResult.push({
          ...item,
          previousValue: this._respondentService.initialRespondentRequirements.involvements[i].value
        });
      }
    });

    respondentRequirements.customCategoryScreens.map((item) => {
      item.answers.map((val) => {
        const match = matchResult.find((involve) => val.value === involve.previousValue);
        if (match) { val.value = match.value; }
      });
    });
    this.translatedRespondentRequirements$.next(respondentRequirements);
  }



  public getTranslates(lang: string): Observable<any> {
    return this._translateService.getTranslation(lang).pipe(tap((res) => {
      this.translations = res;
    }));
  }

  public getTranslatedAssociations(lang?: string): Observable<Association[]> {
    return this._btTestService.getAssociations(lang).pipe(tap((res: Association[]) => {
      this.translatedAssociations = res;
    }));
  }

  public mapTests(association: Association[], translatedAssociations: Association[]): void {
    association.forEach((item) => {
      const match = translatedAssociations.find((tItem) => tItem.id === item.id);
      if (match) { this.translatedTestAssociations.push(match); }
    });
  }

  public isTranslatedSelectedProductName(): string {
    const controlValue = this._bicCategoryService.categoryControl.value;
    const category = this.translatedCategories.find(categoryItem => categoryItem.id === controlValue.id);
    return category?.name;
  }

  public isTranslatedSelectedSubcategories(): string {
    const selectedIds = new Set(this._bicCategoryService.subcategoriesControl.value.map(item => item.id));

    const translatedSubcategories = this.translatedSubcategories
      .filter(item => selectedIds.has(item.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => item.name);

    const customSubCategories = this.customSubcategoriesControl
      .sort((a, b) => a.subcategory.localeCompare(b.subcategory))
      .map(item => item.subcategory);

    const subCategories = [...translatedSubcategories, ...customSubCategories]
      .sort((a, b) => a.localeCompare(b))
      .join(', ');

    return subCategories || this.translations.preview.SELECT_PRODUCT_SUBCATEGORIES;
  }

}
