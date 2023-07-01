import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './my-profile.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminGuard } from '../../shared/guards/admin/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: MyProfileComponent,
    children: [
      {
        path: 'company',
        component: CompanyInformationComponent,
      },
      {
        path: 'personal',
        component: PersonalInformationComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AdminGuard],
      },
      {
        path: '**',
        redirectTo: 'personal',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileRouting {}
