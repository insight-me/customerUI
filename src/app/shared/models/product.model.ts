import { TestType } from '../enums/product.id.type';

export interface Product {
  name: string;
  id: string;
  productName: string;
  productDescription: string;
  testType: TestType;
}
