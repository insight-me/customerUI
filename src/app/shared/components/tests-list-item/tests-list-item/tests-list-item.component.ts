import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';
import {
  ExplanationProductText,
  ProductName,
  TestProductName,
} from '../../../enums/product.id.type';

@Component({
  selector: 'app-tests-list-item',
  templateUrl: './tests-list-item.component.html',
  styleUrls: ['./tests-list-item.component.scss'],
})
export class TestsListItemComponent {
  @Input() product: Product;
  public isCreateTest = false;

  constructor() {}

  public onNewTest(): void {
    this.isCreateTest = true;
  }

  public get TestProductName(): typeof TestProductName {
    return TestProductName;
  }

  public get ExplanationProductText(): typeof ExplanationProductText {
    return ExplanationProductText;
  }
}
