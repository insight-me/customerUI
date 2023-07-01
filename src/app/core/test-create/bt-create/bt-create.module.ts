import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { DialogService } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { TestCreationComponentsModule } from '../../../shared/test-creation-components/test-creation-components.module';
import { BicCreateModule } from '../bic-create/bic-create.module';
import { SharedTestCreationModule } from '../modules/shared-test-creation/shared-test-creation.module';
import { BtCreateRouting } from './bt-create.routing';
import { BrandImageUploadComponent } from './components/brand-image-upload/brand-image-upload.component';
import { BrandImgListComponent } from './components/brand-img-list/brand-img-list.component';
import { BrandNameListComponent } from './components/brand-name-list/brand-name-list.component';
import { BrandsListItemComponent } from './components/brands-list-item/brands-list-item.component';
import { BrandsListComponent } from './components/brands-list/brands-list.component';
import { BtContainerComponent } from './components/bt-container/bt-container.component';
import { HeaderBtComponent } from './components/header-bt/header-bt.component';
import { NoneCheckboxComponent } from './components/none-checkbox/none-checkbox.component';
import { PreviewStepComponent } from './components/preview-step/preview-step.component';
import { SubheaderBtComponent } from './components/subheader-bt/subheader-bt.component';
import { BaseSectionComponent } from './pages/base-section/base-section.component';
import { SectionEightComponent } from './pages/section-eight/section-eight.component';
import { SectionFiveComponent } from './pages/section-five/section-five.component';
import { SectionFourComponent } from './pages/section-four/section-four.component';
import { SectionOneComponent } from './pages/section-one/section-one.component';
import { SectionSevenComponent } from './pages/section-seven/section-seven.component';
import { SectionSixComponent } from './pages/section-six/section-six.component';
import { SectionThreeComponent } from './pages/section-three/section-three.component';
import { SectionTwoComponent } from './pages/section-two/section-two.component';
import { BtOnePreviewComponent } from './preview/bt-one-preview/bt-one-preview.component';
import { BtPreviewAdditionalQuestionsComponent } from './preview/bt-preview-additional-questions/bt-preview-additional-questions.component';
import { BtPreviewAssociateComponent } from './preview/bt-preview-associate/bt-preview-associate.component';
import { BtPreviewBrandsComponent } from './preview/bt-preview-brands/bt-preview-brands.component';
import { BtPreviewCommercialComponent } from './preview/bt-preview-commercial/bt-preview-commercial.component';
import { BtPreviewInputBrandComponent } from './preview/bt-preview-input-brand/bt-preview-input-brand.component';
import { BtPreviewRecommendationComponent } from './preview/bt-preview-recommendation/bt-preview-recommendation.component';
import { BtPreviewComponent } from './preview/bt-preview/bt-preview.component';

const AppModules = [
  BtCreateRouting,
  SharedComponentsModule,
  TestCreationComponentsModule,
  SharedTestCreationModule,
  TooltipModule,
  SharedPipesModule
];

const AppComponents = [
  BtContainerComponent,
  BaseSectionComponent,
  HeaderBtComponent,
  SubheaderBtComponent,
  BrandImageUploadComponent,
  BrandImgListComponent,
  BrandNameListComponent,
  BrandsListComponent,
  BrandsListItemComponent,
  NoneCheckboxComponent,
  PreviewStepComponent,
  SectionOneComponent,
  SectionTwoComponent,
  SectionThreeComponent,
  SectionFourComponent,
  SectionFiveComponent,
  SectionSixComponent,
  SectionSevenComponent,
  SectionEightComponent,
  BtPreviewComponent,
  BtPreviewInputBrandComponent,
  BtPreviewAssociateComponent,
  BtPreviewAdditionalQuestionsComponent,
  BtPreviewBrandsComponent,
  BtOnePreviewComponent,
  BtPreviewCommercialComponent,
  BtPreviewRecommendationComponent
];

@NgModule({
  declarations: [...AppComponents],
  imports: [
    CommonModule,
    ...AppModules,
    SwiperModule,
    SwiperModule,
    SharedModule,
    BicCreateModule,
    InputMaskModule,
    RadioButtonModule
  ],
  providers: [DialogService],
  exports: [
    NoneCheckboxComponent
  ]
})
export class BtCreateModule { }
