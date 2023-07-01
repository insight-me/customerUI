import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TooltipModule } from 'primeng/tooltip';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { DesktopAlertComponent } from './components/desktop-alert/desktop-alert.component';
import { CreateMatrixComponent } from './create-matrix/create-matrix.component';
import { CreateQuestionsComponent } from './create-questions/create-questions.component';
import { CreateSegmentationComponent } from './create-segmentation/create-segmentation.component';
import { CreateSegmentsComponent } from './create-segments/create-segments.component';
import { CustomSegmentationRouting } from './custom-segmentation.routing';
import { SegmentationListComponent } from './segmentation-list/segmentation-list.component';
import { SegmentationPageComponent } from './segmentation-page/segmentation-page.component';
import { SelectScaleComponent } from './select-scale/select-scale.component';

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  CustomSegmentationRouting,
];

const AppComponents = [
  SegmentationPageComponent,
  DesktopAlertComponent,
  CreateSegmentationComponent,
  CreateSegmentsComponent,
  SegmentationListComponent,
  CreateQuestionsComponent,
  CreateMatrixComponent,
  SelectScaleComponent
];

@NgModule({
  declarations: [AppComponents],
  imports: [...AppModules, AngularSvgIconModule, TooltipModule],
})
export class CustomSegmentationModule { }
