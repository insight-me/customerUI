import { NgModule } from '@angular/core';
import { RootComponent } from './root-component/root.component';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { RootRoutingModule } from './root-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    RootComponent,
    NotFoundComponent,
    HeaderComponent,
    ThankYouPageComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RootRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    MenubarModule,
    TranslateModule,
    AngularSvgIconModule,
    SharedComponentsModule,
  ],
  exports: [HeaderComponent],
})
export class RootModule {}
