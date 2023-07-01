import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { LEFT_TRIM_PATTERN, MAX_BRAND_NAME_LENGTH, MIN_BRAND_NAME_LENGTH } from '../../../../../../assets/consts/test-creation.const';
import { checkExist } from '../../../../../shared/validators/check-exist.validator';
import { BTBrand } from '../../../../../shared/models/bt-test.model';
import { SessionStorageService } from '../../../../../shared/services/app-state/session-storage.service';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { BTBrandHolders } from '../../../../../shared/enums/bt.creation.type';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-brands-list-item',
  templateUrl: './brands-list-item.component.html',
  styleUrls: ['./brands-list-item.component.scss'],
})
export class BrandsListItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public index: number;
  @Input() public brands: BTBrand[] = [];
  @Input() public type: BTBrandHolders;
  @Input() public allImages: string[] = [];
  @Input() public allImagesHash: string[] = [];

  @Input() set allBrands(data) {
    if (data) {
      this.testBrands = data;
    }
  }

  @Input()
  public set brand(data: BTBrand) {
    this.$brand = data;
    this.brandField.setValue(this.brand.name);
    if (data.name) {
      this.brandField.markAsTouched();
    }
  }

  public get brand(): BTBrand {
    return this.$brand;
  }

  @Output() public deleteBrand: EventEmitter<number> = new EventEmitter();
  @Output() public updateBrandName: EventEmitter<{ name: string; i: number }> = new EventEmitter();
  @Output() public updateBrandImage: EventEmitter<{
    imageData: string;
    imageHash: string;
    i: number;
  }> = new EventEmitter();

  public brandField = new FormControl('', [
    Validators.required,
    Validators.minLength(MIN_BRAND_NAME_LENGTH),
    Validators.maxLength(MAX_BRAND_NAME_LENGTH),
  ]);
  public errors: { [index: string]: string } = {
    required: 'BT-brands.Brand name missed.',
    minlength: 'BT-brands.Brand name should be between 2 and 30 symbols.',
    maxlength: 'BT-brands.Brand name should be between 2 and 30 symbols.',
    checkExist: 'BT-brands.Brand name exists.',
  };
  public testBrands: BTBrand[] = [];
  private $brand: BTBrand;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private sessionStorageService: SessionStorageService, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.brandField.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(name => {
      if (name !== name.replace(LEFT_TRIM_PATTERN, '')) {
        this.brandField.setValue(name.replace(LEFT_TRIM_PATTERN, ''));
        this.brand.isNew = false;
      }
      this.updateBrandName.emit({ name, i: this.index });
    });
  }

  public ngAfterViewInit(): void {
    this._updateNameFieldValidity();
  }

  public ngOnDestroy(): void {
    this.brand.isNew = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public convertToFormControl(absCtrl: AbstractControl): FormControl {
    return absCtrl as FormControl;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public delete(): void {
    this.deleteBrand.emit(this.index);
  }

  public updateImage(img: { imageData: string; imageHash: string }): void {
    this.updateBrandImage.emit({ ...img, i: this.index });
  }

  public onDeleteImage(): void {
    this.updateBrandImage.emit({ imageData: '', imageHash: '', i: this.index });
  }

  private _updateNameFieldValidity(): void {
    const allBrandNames = [];
    this.testBrands
      .filter(value => value.name !== this.brandField.value)
      .forEach(value => {
        allBrandNames.push(value.name);
      });
    this.brandField.setValidators([
      Validators.required,
      Validators.minLength(MIN_BRAND_NAME_LENGTH),
      Validators.maxLength(MAX_BRAND_NAME_LENGTH),
      checkExist(allBrandNames),
    ]);
    this.brandField.updateValueAndValidity();
    if (!this.brand.isNew) {
      this.brandField.markAsTouched();
      this.brandField.markAsDirty();
    }
    this.cdr.detectChanges();
  }
}
