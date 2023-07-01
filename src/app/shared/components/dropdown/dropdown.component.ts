import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { RegionsLabel, SegmentLabel, SubcategoriesLabel } from '../../models/test.model';
import { TranslateService } from '@ngx-translate/core';
import { DropdownDataType } from '../../enums/dropdown.type';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  @Input() public items = [];
  @Input() public selectedItem = '';
  @Input() public defaultLabel = '';
  @Input() public isError = false;
  @Input() public withMultiselect = false;
  @Input() public selectedItems = [];
  @Input() public isDesibled = false;
  @Input() public maxHeight = 300;
  @Input() public dataType: DropdownDataType;
  @ViewChild('dropdownList') public dropdownListComponent;
  @ViewChild('dropBtn') public dropdownButtonComponent;
  @Output() public getSelectedItem = new EventEmitter();
  @Output() public getSelectedItems = new EventEmitter();
  @Output() public onOpen = new EventEmitter();
  private sub = new Subscription();
  public isChangesStyle = false;

  constructor(private translateService: TranslateService) {}

  public ngAfterViewInit(): void {
    this.sub = fromEvent(document.body, 'click').subscribe(event => {
      if (this.withMultiselect) {
        if (
          !this.dropdownButtonComponent.nativeElement.contains(event.target) &&
          !this.dropdownListComponent.nativeElement.contains(event.target)
        ) {
          this.closeDropdown();
        }
      } else {
        if (!this.dropdownButtonComponent.nativeElement.contains(event.target)) {
          this.closeDropdown();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public get isSegmentation(): boolean {
    return this.dataType === DropdownDataType.Segmentation || this.dataType === DropdownDataType.CustomSegmentation;
  }

  public get withSelectAll(): boolean {
    return this.withMultiselect && this.dataType !== DropdownDataType.InvolvmentSubcategory;
  }

  public toggleDropdown(event): void {
    if (this.items.length) {
      if (!this.withMultiselect || (!this.dropdownListComponent.nativeElement.contains(event.target) && this.withMultiselect)) {
        this.onOpen.emit();
        this.dropdownListComponent.nativeElement.scrollTop = 0;
        this.dropdownListComponent.nativeElement.classList.toggle('show');
        this.dropdownButtonComponent.nativeElement.classList.toggle('show');
      }
    }
  }

  public toggleAll(): void {
    if (this.dataType === DropdownDataType.Segmentation) {
      if (this.selectedItems.length - 1 === this.items.length) {
        this.selectedItems = [];
        this.getSelectedItems.emit(this.selectedItems);
      } else {
        this.selectedItems = this.items.filter(segment => !segment.isDefault);
        this.getSelectedItems.emit(this.selectedItems);
      }
    } else {
      if (this.selectedItems.length === this.items.length) {
        this.selectedItems = [];
        this.getSelectedItems.emit(this.selectedItems);
      } else {
        this.selectedItems = this.items;
        this.getSelectedItems.emit(this.selectedItems);
      }
    }
  }

  public isCheckedAll(): boolean {
    if (this.dataType === DropdownDataType.Segmentation) {
      return this.items.length === this.selectedItems.length - 1;
    }
    return this.items?.length === this.selectedItems.length;
  }

  public isDisabledItem(item): boolean {
    if (this.dataType !== DropdownDataType.InvolvmentSubcategory) {
      return false;
    }
    return this.selectedItems.length > 3 && !this.isChecked(item);
  }

  public closeDropdown(): void {
    this.dropdownListComponent.nativeElement.classList.remove('show');
    this.dropdownButtonComponent.nativeElement.classList.remove('show');
  }

  public getTitle(): string {
    return this.selectedItem ? this.selectedItem : this.defaultLabel;
  }

  public getMultiselectTitle(): string {
    switch (this.dataType) {
      case DropdownDataType.Segmentation:
        if (this.selectedItems.length < 2) {
          this.isChangesStyle = false;
          return SegmentLabel.Default;
        }
        if (this.selectedItems.length - 1 === this.items.length) {
          this.isChangesStyle = true;
          return SegmentLabel.All;
        }
        this.isChangesStyle = true;
        return `${this.selectedItems.length - 1} ${this.translateService.instant('respondents.segments-selected')}`;
      case DropdownDataType.CustomSegmentation:
        if (this.selectedItems.length < 1) {
          this.isChangesStyle = false;
          return SegmentLabel.Default;
        }
        if (this.selectedItems.length === this.items.length) {
          this.isChangesStyle = true;
          return SegmentLabel.All;
        }
        this.isChangesStyle = true;
        return `${this.selectedItems.length} ${this.translateService.instant('respondents.segments-selected')}`;
      case DropdownDataType.AgeGroup:
        if (this.selectedItems.length < 1) {
          this.isChangesStyle = false;
          return this.translateService.instant('report.Choose age group');
        }
        if (this.selectedItems.length === this.items.length) {
          this.isChangesStyle = true;
          return this.translateService.instant('report.All age groups');
        }
        this.isChangesStyle = true;
        return `${this.selectedItems.length} ${this.translateService.instant('report.age group(s) selected')}`;
      case DropdownDataType.Regions:
        if (this.selectedItems.length < 1) {
          this.isChangesStyle = false;
          return RegionsLabel.Default;
        }
        if (this.selectedItems.length === this.items.length) {
          this.isChangesStyle = true;
          return RegionsLabel.All;
        }
        this.isChangesStyle = true;
        return `${this.selectedItems.length} ${this.translateService.instant('respondents.regions-selected')}`;
      case DropdownDataType.InvolvmentSubcategory:
        if (!this.selectedItems.length) {
          this.isChangesStyle = false;
          return SubcategoriesLabel.Default;
        }
        if (this.selectedItems.length === 1) {
          this.isChangesStyle = true;
          return SubcategoriesLabel.One;
        }
        this.isChangesStyle = true;
        return `${this.selectedItems.length} ${this.translateService.instant('respondents.subcategories selected')}`;
    }
  }

  public selectItem(item): void {
    this.getSelectedItem.emit(item);
  }

  public isChecked(item): boolean {
    return !!this.selectedItems.filter(region => region.id === item.id).length;
  }

  public selectRegion(item): void {
    if (this.selectedItems.find(region => item.id === region.id)) {
      this.selectedItems = this.selectedItems.filter(region => item.id !== region.id);
    } else {
      this.selectedItems.push(item);
    }
    this.getSelectedItems.emit(this.selectedItems);
  }
}
