import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BTBrand } from '../../../../../shared/models/bt-test.model';
import { BTBrandHolders } from '../../../../../shared/enums/bt.creation.type';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss'],
})
export class BrandsListComponent {
  @Input() public brands: BTBrand[] = [];
  @Input() public id = '';
  @Input() public allBrands = [];
  @Input() public type: BTBrandHolders;
  @Input() public allImages: string[] = [];
  @Input() public allImagesHash: string[] = [];
  @Output() public deleteBrand: EventEmitter<number> = new EventEmitter();
  @Output() public updateBrandName: EventEmitter<{ name: string; i: number }> =
    new EventEmitter();
  @Output() public updateBrandImage: EventEmitter<{
    imageData: string;
    imageHash: string;
    i: number;
  }> = new EventEmitter();
}
