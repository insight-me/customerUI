import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MainPageRoutingModule } from './main-page.routing';
import { MainPageHeaderComponent } from './components/main-page-header/main-page-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { SharedDialogsModule } from '../../shared/dialogs/shared-dialogs.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { MainPageFooterComponent } from './components/main-page-footer/main-page-footer.component';
import { StartPageComponent } from './start-page/start-page.component';
import { TasteComponent } from './components/taste/taste.component';
import { AngularSplitModule } from 'angular-split';
import { TrustedByComponent } from './components/trusted-by/trusted-by.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { QuoteSectionComponent } from './components/quote-section/quote-section.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { GuessFindOutComponent } from './components/guess-find-out/guess-find-out.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AboutUsPageComponent } from './about-us-page/about-us-page.component';
import { SelfCardComponent } from './components/self-card/self-card.component';
import { ScrollSwipeComponent } from './components/scroll-swipe/scroll-swipe.component';
import { MainPageService } from './main-page.service';

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  SharedModule,
  SharedDialogsModule,
  MatExpansionModule,
  MatMenuModule,
  AngularSplitModule,
];
const AppComponents = [
  MainPageComponent,
  MainPageHeaderComponent,
  MainPageFooterComponent,
  StartPageComponent,
  TasteComponent,
  TrustedByComponent,
  // WayToFindComponent,
  // ResearchProductsComponent,
  // WhyInsightmeComponent,
  QuoteSectionComponent,
  ContactUsComponent,
  // ResearchProductsPageComponent,
  SectionHeaderComponent,
  GuessFindOutComponent,
  ProductListComponent,
  AboutUsPageComponent,
  SelfCardComponent,
  ScrollSwipeComponent,
];

@NgModule({
  declarations: [...AppComponents],
  imports: [MainPageRoutingModule, ...AppModules, SwiperModule],
  providers: [MainPageService],
  exports: [...AppComponents],
})
export class MainPageModule {}
