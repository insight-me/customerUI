import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module';
import { WhyAddMobileComponent } from './why-add-mobile/why-add-mobile.component';
import { MarketComponent } from './market/market.component';
import { AgeFormComponent } from './age-form/age-form.component';
import { GenderFormComponent } from './gender-form/gender-form.component';
import { SegmentationFormComponent } from './segmentation-form/segmentation-form.component';
import { RespNumberContainerComponent } from './resp-number-container/resp-number-container.component';
import { RespNumberElementComponent } from './resp-number-element/resp-number-element.component';
import { IncidentRateComponent } from './incident-rate/incident-rate.component';
import { InvolvmentCategoryComponent } from './involvment-category/involvment-category.component';
import { PopupInformationComponent } from './popup-information/popup-information.component';
import { NextButtonComponent } from './next-button/next-button.component';
import { InvoicePaymentComponent } from './invoice-payment/invoice-payment.component';
import { ConfirmAndRunFormComponent } from './confirm-and-run-form/confirm-and-run-form.component';
import { PaymentSelectionComponent } from './payment-selection/payment-selection.component';
import { WhyAddComponent } from './why-add/why-add.component';
import { MobileWhyAddComponent } from './mobile-why-add/mobile-why-add.component';

const AppComponents = [
  WhyAddMobileComponent,
  MarketComponent,
  AgeFormComponent,
  GenderFormComponent,
  SegmentationFormComponent,
  RespNumberContainerComponent,
  RespNumberElementComponent,
  IncidentRateComponent,
  InvolvmentCategoryComponent,
  PopupInformationComponent,
  NextButtonComponent,
  InvoicePaymentComponent,
  ConfirmAndRunFormComponent,
  PaymentSelectionComponent,
  WhyAddComponent,
  MobileWhyAddComponent,
];

const AppModules = [SharedComponentsModule, CommonModule];

@NgModule({
  declarations: [...AppComponents],
  imports: [...AppModules],
  exports: [...AppComponents],
})
export class SharedTestCreationModule {}
