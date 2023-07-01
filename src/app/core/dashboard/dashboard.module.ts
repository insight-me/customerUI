import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DashboardRouting } from './dashboard.routing';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CreatedTestsComponent } from './created-tests/created-tests.component';
import { SWIPER_CONFIG, SwiperModule } from 'ngx-swiper-wrapper';
import { DEFAULT_SWIPER_CONFIG } from 'src/assets/consts/swiper.consts';
import { SharedModule } from '../../shared/modules/shared.module';

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  DashboardRouting,
  SwiperModule,
];

@NgModule({
  declarations: [DashboardPageComponent, CreatedTestsComponent],
  imports: [...AppModules, SharedModule],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
  ],
})
export class DashboardModule {
}
