import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../components/shared-components.module';
import { HeaderComponent } from './header/header.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { LegalComponent } from './legal/legal.component';
import { LegalRoutingModule } from './legal-routing.module';

@NgModule({
  declarations: [
    LegalComponent,
    TermsComponent,
    PrivacyComponent,
    HeaderComponent
  ],
  imports: [
    LegalRoutingModule,
    CommonModule,
    SharedComponentsModule,
  ],
})
export class LegalModule {
}
