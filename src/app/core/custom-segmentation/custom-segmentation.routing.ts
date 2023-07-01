import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SegmentationPageComponent } from './segmentation-page/segmentation-page.component';
import { CreateSegmentationComponent } from './create-segmentation/create-segmentation.component';

const routes: Routes = [
  {
    path: '',
    component: SegmentationPageComponent
  },
  {
    path: 'create-segmentation',
    component: CreateSegmentationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomSegmentationRouting {
}
