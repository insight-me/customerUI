import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SharedTestCreationModule } from '../../core/test-create/modules/shared-test-creation/shared-test-creation.module';
import { SharedComponentsModule } from '../components/shared-components.module';
import { TRANSLATE_MODULE_CONFIG } from '../configs/translate.config';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { CategoryScreeningComponent } from './category-screening/category-screening.component';
import { AddImageComponent } from './components/open-questions/add-image/add-image.component';
import { AddedQuestionsComponent } from './components/open-questions/added-questions/added-questions.component';
import { OpenQuestionsPreviewComponent } from './components/open-questions/open-questions-preview/open-questions-preview.component';
import { OpenQuestionsComponent } from './components/open-questions/open-questions/open-questions.component';
import { OptionListComponent } from './components/open-questions/option-list/option-list.component';
import { CustomScreeningComponent } from './custom-screening/custom-screening.component';
import { GridTableComponent } from './grid-table/grid-table.component';
import { PredesignMustEngageComponent } from './predesign-must-engage/predesign-must-engage.component';
import { PredesignedScreeningComponent } from './predesigned-screening/predesigned-screening.component';

const commonDeclarations = [
  OpenQuestionsComponent,
  AddImageComponent,
  OptionListComponent,
  AddedQuestionsComponent,
  OpenQuestionsPreviewComponent,
  CategoryScreeningComponent,
  PredesignedScreeningComponent,
  PredesignMustEngageComponent,
  CustomScreeningComponent,
];
const commonModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  ToastModule,
  MatMenuModule,
  InputTextModule,
  DragDropModule,
  SharedComponentsModule,
];

@NgModule({
  declarations: [...commonDeclarations, GridTableComponent],
  imports: [
    ...commonModules,
    TranslateModule.forChild(TRANSLATE_MODULE_CONFIG),
    SharedTestCreationModule,
    SwiperModule,
    SharedPipesModule
  ],
  exports: [...commonModules, ...commonDeclarations],
})
export class TestCreationComponentsModule { }
