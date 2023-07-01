import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RadioBlockComponent } from '../../core/test-create/modules/shared-test-creation/radio-block/radio-block.component';
import { TRANSLATE_MODULE_CONFIG } from '../configs/translate.config';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { CustomScaleComponent } from './custom-scale/custom-scale.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { EditListItemComponent } from './edit-list-item/edit-list-item.component';
import { ExportInvoiceComponent } from './export-invoice/export-invoice.component';
import { BaseFormElementComponent } from './form-elements/base-form-element.component';
import { RadioButtonComponent } from './form-elements/radio-button/radio-button.component';
import { FormInputComponent } from './form-input/form-input.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { IconComponent } from './icon/icon.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { MoodboardPreviewComponent } from './moodboard-preview/moodboard-preview.component';
import { MoodboardItemComponent } from './moodboard-upload/moodboard-item/moodboard-item.component';
import { MoodboardUploadComponent } from './moodboard-upload/moodboard-upload.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { OverlayTipComponent } from './overlay-tip/overlay-tip.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PaymentFailComponent } from './payment-fail/payment-fail.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { QuestionTooltipComponent } from './question-tooltip/question-tooltip.component';
import { RangeInputComponent } from './range-input/range-input.component';
import { SetTestNameComponent } from './set-test-name/set-test-name/set-test-name.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { TestsListItemComponent } from './tests-list-item/tests-list-item/tests-list-item.component';
import { TestsListComponent } from './tests-list/tests-list.component';
import { ToastComponent } from './toast/toast.component';
import { WarningMessageComponent } from './warning-message/warning-message.component';

const commonModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  ToastModule,
  InputTextModule,
  InputTextareaModule,
  OverlayPanelModule,
  CheckboxModule,
  InputNumberModule,
  MenuModule,
  DragDropModule,
  SelectButtonModule,
  CalendarModule,
  SliderModule,
  NgxPaginationModule,
  OverlayModule
];

const commonDeclarations = [
  SpinnerComponent,
  ToastComponent,
  ImageUploadComponent,
  ListItemsComponent,
  MoodboardUploadComponent,
  MoodboardPreviewComponent,
  HeaderMenuComponent,
  TestsListComponent,
  MoodboardItemComponent,
  PaymentSuccessComponent,
  TestsListItemComponent,
  SetTestNameComponent,
  IconComponent,
  FormInputComponent,
  RadioBlockComponent,
  BaseFormElementComponent,
  DropdownComponent,
  RadioButtonComponent,
  WarningMessageComponent,
  CustomScaleComponent
];

@NgModule({
  imports: [
    ...commonModules,
    SharedPipesModule,
    SharedDirectivesModule,
    DropdownModule,
    TranslateModule.forChild(TRANSLATE_MODULE_CONFIG),
    AngularSvgIconModule,
    NgCircleProgressModule.forRoot({
      radius: 36,
      titleFontSize: '18',
      unitsFontSize: '18',
      backgroundPadding: 0,
      titleFontWeight: 'bold',
      unitsFontWeight: 'bold',
      outerStrokeWidth: 10,
      innerStrokeWidth: 10,
      outerStrokeColor: '#AFEBAB',
      innerStrokeColor: '#FFFFFF',
      animation: true,
      showSubtitle: false,
      space: -10,
      outerStrokeLinecap: 'butt',
      animationDuration: 300,
    }),
    MultiSelectModule,
    TooltipModule,
  ],
  declarations: [
    ...commonDeclarations,
    EditListItemComponent,
    QuestionTooltipComponent,
    PaymentFailComponent,
    ExportInvoiceComponent,
    TableFilterComponent,
    PaginationComponent,
    NotificationMessageComponent,
    RangeInputComponent,
    OverlayTipComponent,
  ],
  providers: [NgxImageCompressService],
  exports: [
    ...commonModules,
    ...commonDeclarations,
    TranslateModule,
    NgCircleProgressModule,
    EditListItemComponent,
    QuestionTooltipComponent,
    PaymentFailComponent,
    ExportInvoiceComponent,
    TableFilterComponent,
    PaginationComponent,
    RangeInputComponent,
    NotificationMessageComponent,
    OverlayTipComponent
  ]
})
export class SharedComponentsModule { }
