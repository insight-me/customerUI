import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomTranslateService } from 'src/app/shared/services/custom-translate.service';
import { MAX_BRANDS_FOR_ASSOCIATION_STEP_BT } from '../../../../../../assets/consts/consts';
import { BTBrand } from '../../../../../shared/models/bt-test.model';
import { getRandomArray } from '../../../../../shared/utils/random-array.utils';
import { Association } from './../../../../../shared/models/test.model';

@Component({
  selector: 'app-bt-preview-associate',
  templateUrl: './bt-preview-associate.component.html',
  styleUrls: ['./bt-preview-associate.component.scss',
    '../../../../../shared/test-creation-components/components/open-questions/open-questions-preview/open-questions-preview.component.scss',
    '../../../bic-create/components/preview-slider/preview-slider.component.scss']
})
export class BtPreviewAssociateComponent implements OnDestroy, OnInit {
  @Input()
  public set test(test: any) {
    if (test?.btTestAssociations?.length || test?.customAssociations?.length) {
      this.$test = test;
    }
  }

  public get test(): any {
    return this.$test;
  }
  public brandsForAssociations: BTBrand[];

  public translatedAssociations: Association[];
  private $test: any;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _customTranslateService: CustomTranslateService) { }

  public ngOnInit(): void {
    this.getAssociations();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  public getWidthForFirstColumn(): number {
    return this.brandsForAssociations.length > 5 ? 220 : 300;
  }

  private getAssociations(): void {
    if (JSON.parse(localStorage.getItem('language')) !== 'EN') {
      const previewLang = localStorage.getItem('previewLanguage');
      this._customTranslateService.getTranslatedAssociations(previewLang)
        .pipe(tap((res) => {
          const translatedAssociations = [];

          this.test.btTestAssociations.forEach((item: Association) => {
            const match = res.find((tItem) => tItem.id === item.id);
            if (match) {
              translatedAssociations.push(match);
            }
          });

          this.translatedAssociations = [...translatedAssociations, ...this.test.customAssociations]
            .sort((a, b) => a.sort - b.sort);

          this.createOrderForAssociations();
        })).subscribe();

    }
  }

  private createOrderForAssociations(): void {
    let ownBrands = [];
    this.test.brands.forEach((brand) => {
      if (brand.isOwn) {
        ownBrands.push(brand);
      }
    });
    if (ownBrands.length) {
      ownBrands = getRandomArray(ownBrands);
      this.brandsForAssociations = ownBrands;
    }
    let otherBrands = [];
    this.test.brands.forEach((brand) => {
      if (!brand.isOwn) {
        otherBrands.push(brand);
      }
    });
    otherBrands = getRandomArray(otherBrands);
    this.brandsForAssociations = this.brandsForAssociations?.concat(otherBrands).slice(0, MAX_BRANDS_FOR_ASSOCIATION_STEP_BT);
  }
}
