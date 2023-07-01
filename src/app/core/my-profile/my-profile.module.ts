import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RouterModule } from '@angular/router';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { SharedDialogsModule } from 'src/app/shared/dialogs/shared-dialogs.module';
import { MyProfileComponent } from './my-profile.component';
import { MyProfileRouting } from './my-profile.routing';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { SettingsComponent } from './settings/settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeCompanyAddressComponent } from './change-company-address/change-company-address.component';


const AppComponents = [
  MyProfileComponent,
  PersonalInformationComponent,
  CompanyInformationComponent,
  SettingsComponent
];

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  SharedDirectivesModule,
  MyProfileRouting,
  InputTextModule,
  DropdownModule,
  InputSwitchModule,
  RouterModule,
  ListboxModule,
  TooltipModule,
  SharedDialogsModule
];

@NgModule({
  declarations: [...AppComponents, ChangePasswordComponent, ChangeCompanyAddressComponent],
  imports: [...AppModules],
  exports: [],
})
export class MyProfileModule {}
