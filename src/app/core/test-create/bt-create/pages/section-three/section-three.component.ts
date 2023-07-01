import { ChangeDetectionStrategy, Component } from '@angular/core';
import { differenceWith, isEqual, uniq } from 'lodash';
import { MAX_BRANDS } from '../../../../../../assets/consts/bt-test.consts';
import { COLORS3 } from '../../../../../../assets/consts/consts';
import {
  MAX_BRAND_NAME_LENGTH,
  MIN_BRAND_NAME_LENGTH
} from '../../../../../../assets/consts/test-creation.const';
import { BTBrandHolders } from '../../../../../shared/enums/bt.creation.type';
import { BTBrand } from '../../../../../shared/models/bt-test.model';
import { BaseSectionComponent } from '../base-section/base-section.component';

@Component({
  selector: 'app-section-three',
  templateUrl: './section-three.component.html',
  styleUrls: [
    './section-three.component.scss',
    '../../../components/test-create-container/test-create-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionThreeComponent extends BaseSectionComponent {
  public currentSection = 'section-3';
  public mode: BTBrandHolders = BTBrandHolders.OWN;

  public get checkIfHaveChanges(): boolean {
    return this._compareTest();
  }

  public get ownBrands(): BTBrand[] {
    const ownArray = this.test.brands?.filter((brand) => brand.isOwn);
    return ownArray?.length ? ownArray : [];
  }

  public get otherBrands(): BTBrand[] {
    const otherArray = this.test.brands?.filter((brand) => !brand.isOwn);
    return otherArray?.length ? otherArray : [];
  }

  public get allImages(): string[] {
    const allImg = [];
    this.test.brands.forEach((brand) => {
      if (brand.imageData) {
        allImg.push(brand.imageData);
      }
    });
    return allImg;
  }

  public get allImagesHash(): string[] {
    const allImgHash = [];
    this.test.brands.forEach((brand) => {
      if (brand.imageHash) {
        allImgHash.push(brand.imageHash);
      }
    });
    return allImgHash;
  }

  public get allBrandNames(): string[] {
    const allBrandNames = [];
    this.test.brands.forEach((brand) => {
      if (brand.name) {
        allBrandNames.push(brand.name);
      }
    });
    return allBrandNames;
  }

  public get isDisabledAddBrandButton(): boolean {
    return this._isDisableAddBrandButton(this.ownBrands);
  }

  public get isDisabledOtherAddBrandButton(): boolean {
    return this._isDisableAddBrandButton(this.otherBrands);
  }

  public setInitActions(): void {
    this._setInSessionStorage();
  }

  public updateOwnImages(brands: BTBrand[]): void {
    this.test.brands = this.otherBrands.concat(brands);
    this.cdr.detectChanges();
  }

  public updateOtherImages(brands: BTBrand[]): void {
    this.test.brands = this.ownBrands.concat(brands);
    this.cdr.detectChanges();
  }

  public updateOwnBrandName(brandInfo: { name: string; i: number }): void {
    const updatedArray = [...this.ownBrands];
    updatedArray[brandInfo.i].name = brandInfo.name;
    this.updateOwnImages(updatedArray);
  }

  public updateOtherBrandName(brandInfo: { name: string; i: number }): void {
    const updatedArray = [...this.otherBrands];
    updatedArray[brandInfo.i].name = brandInfo.name;
    this.updateOtherImages(updatedArray);
  }

  public updateOwnBrandImage(image: {
    imageData: string;
    imageHash: string;
    i: number;
  }): void {
    const updatedArray = [...this.ownBrands];
    this._setUpdatedImages(updatedArray, image);
    this.updateOwnImages(updatedArray);
  }

  public updateOtherBrandImage(image: {
    imageData: string;
    imageHash: string;
    i: number;
  }): void {
    const updatedArray = [...this.otherBrands];
    this._setUpdatedImages(updatedArray, image);
    this.updateOtherImages(updatedArray);
  }

  public get modeEnum(): typeof BTBrandHolders {
    return BTBrandHolders;
  }

  public deleteOwnBrand(index: number): void {
    const updatedArray = this.ownBrands.filter((item, i) => i !== index);
    this.updateOwnImages(updatedArray);
  }

  public deleteOtherBrand(index: number): void {
    const updatedArray = this.otherBrands.filter((item, i) => i !== index);
    this.updateOtherImages(updatedArray);
  }

  public onAddBrand(type: BTBrandHolders): void {
    const newBrand = {
      testId: this.btStateService.testId,
      image: '',
      imageData: '',
      description: '',
      imageHash: '',
      name: '',
      isOwn: type === BTBrandHolders.OWN,
      needRemove: false,
      color: this._brandColor,
      isNew: true,
    };
    this._removeNewBrands();
    if (type === BTBrandHolders.OWN) {
      this.ownBrands.push(newBrand);
    } else {
      this.otherBrands.push(newBrand);
    }
    this.test.brands.push(newBrand);
  }

  private _setInSessionStorage(): void {
    if (!this.sessionStorageService.getBt(this.test?.id)) {
      this.sessionStorageService.setBt(this.test?.id);
    }
  }

  private _isDisableAddBrandButton(brands: BTBrand[]): boolean {
    const brandNames = this.test.brands.map((brand) => brand.name);
    return (
      brandNames.length !== uniq(brandNames).length ||
      this.test.brands.length === MAX_BRANDS ||
      !!brands.find(
        (item) =>
          item.name.length < MIN_BRAND_NAME_LENGTH ||
          item.name.length > MAX_BRAND_NAME_LENGTH
      ) || brands.length === (MAX_BRANDS - 1)
    );
  }

  private get _brandColor(): string {
    return COLORS3.filter(
      (color) => !this.test.brands.map((item) => item.color).includes(color)
    )[0];
  }

  private _compareTest(): boolean {
    let isDiff = false;
    if (
      differenceWith(this.initTest?.brands, this.test?.brands, isEqual).length
    ) {
      isDiff = true;
    }
    if (
      differenceWith(this.test?.brands, this.initTest?.brands, isEqual).length
    ) {
      isDiff = true;
    }
    return isDiff;
  }

  private _setUpdatedImages(
    updatedArray: BTBrand[],
    image: {
      imageData: string;
      imageHash: string;
      i: number;
    }
  ): void {
    updatedArray[image.i].imageData = image.imageData;
    updatedArray[image.i].imageHash = image.imageHash;
    updatedArray[image.i].needRemove = false;
    if (!image.imageHash && !image.imageData) {
      updatedArray[image.i].image = '';
      updatedArray[image.i].needRemove = true;
    }
  }

  private _removeNewBrands(): void {
    this.ownBrands.forEach(brand => brand.isNew = false);
    this.otherBrands.forEach(brand => brand.isNew = false);
  }
}


