import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { TestCreationComponentsModule } from '../../../shared/test-creation-components/test-creation-components.module';
import { SharedTestCreationModule } from '../modules/shared-test-creation/shared-test-creation.module';
import { TextInputHighlightModule } from '../modules/textarea-tags';
import { TextareaTagsComponent } from '../modules/textarea-tags/textarea-tags.component';
import { BicCreateRouting } from './bic-create.routing';
import { BicContainerComponent } from './components/bic-container/bic-container.component';
import { BicHeaderComponent } from './components/bic-header/bic-header.component';
import { PreviewSliderComponent } from './components/preview-slider/preview-slider.component';
import { PromptOneComponent } from './components/prompt-one/prompt-one/prompt-one.component';
import { PromptComponent } from './components/prompt/prompt/prompt.component';
import { SectionThreeInfoComponent } from './components/section-three-info/section-three-info.component';
import { SubheaderElementComponent } from './components/subheader-element/subheader-element.component';
import { SectionFiveComponent } from './pages/section-five/section-five.component';
import { SectionFourComponent } from './pages/section-four/section-four.component';
import { SectionOneComponent } from './pages/section-one/section-one.component';
import { SectionSixComponent } from './pages/section-six/section-six.component';
import { SectionThreeComponent } from './pages/section-three/section-three.component';
import { SectionTwoComponent } from './pages/section-two/section-two.component';
import { PreviewCategoryScreeningComponent } from './preview/preview-category-screening/preview-category-screening.component';
import { PreviewFeedbackComponent } from './preview/preview-feedback/preview-feedback.component';
import { PreviewFourComponent } from './preview/preview-four/preview-four.component';
import { PreviewOneComponent } from './preview/preview-one/preview-one.component';
import { PreviewRelevanceComponent } from './preview/preview-relevance/preview-relevance.component';
import { PreviewThreeComponent } from './preview/preview-three/preview-three.component';
import { PreviewTwoComponent } from './preview/preview-two/preview-two.component';
import { PreviewComponent } from './preview/preview/preview.component';


const AppModules = [
  BicCreateRouting,
  SharedComponentsModule,
  TestCreationComponentsModule,
  TextInputHighlightModule,
  SharedTestCreationModule,
  TooltipModule,
  SharedPipesModule
];

const AppComponents = [
  BicContainerComponent,
  BicHeaderComponent,
  SectionOneComponent,
  SectionTwoComponent,
  SectionThreeComponent,
  SectionFourComponent,
  SectionFiveComponent,
  SectionSixComponent,
  PromptComponent,
  PromptOneComponent,
  SectionThreeInfoComponent,
  TextareaTagsComponent,
  PreviewComponent,
  PreviewFeedbackComponent,
  PreviewFourComponent,
  PreviewOneComponent,
  PreviewRelevanceComponent,
  PreviewThreeComponent,
  PreviewTwoComponent,
  PreviewSliderComponent,
  PreviewCategoryScreeningComponent,
  SubheaderElementComponent
];

@NgModule({
  declarations: [...AppComponents],
  imports: [CommonModule, ...AppModules],
  exports: [
    PromptComponent,
    PreviewThreeComponent,
    PreviewFeedbackComponent,
    PreviewCategoryScreeningComponent
  ]
})
export class BicCreateModule { }
