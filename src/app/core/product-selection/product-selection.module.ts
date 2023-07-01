import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ProductSelectionRouting } from './product-selection.routing';
import { ProductSelectionPageComponent } from './product-selection-page/product-selection-page.component';

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  ProductSelectionRouting,
];

@NgModule({
  declarations: [ProductSelectionPageComponent],
  imports: [...AppModules],
})
export class ProductSelectionModule {}
