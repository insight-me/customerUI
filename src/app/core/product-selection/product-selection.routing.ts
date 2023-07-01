import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductSelectionPageComponent } from "./product-selection-page/product-selection-page.component";

const routes: Routes = [
  {
    path: '',
    component: ProductSelectionPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSelectionRouting {}
