import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/shared/guards/admin/admin.guard';
import { CompanyResolver } from 'src/app/shared/resolvers/company.resolve';
import { CountryResolver } from 'src/app/shared/resolvers/country.resolve';
import { RespondentOptionsResolver } from 'src/app/shared/resolvers/respondent-options.resolve';
import { IsLoggedGuard, NotLoggedGuard } from '../../shared/guards';
import { RootComponent } from './root-component/root.component';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('../main-page/main-page.module').then((m) => m.MainPageModule),
  //   canActivate: [NotLoggedGuard],
  // },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('../../shared/legal/legal.module').then((m) => m.LegalModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NotLoggedGuard],
  },
  {
    path: 'personal-area',
    component: RootComponent,
    canActivate: [IsLoggedGuard],
    resolve: {
      company: CompanyResolver,
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'product-selection',
        loadChildren: () =>
          import('../product-selection/product-selection.module').then(
            (m) => m.ProductSelectionModule
          ),
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('../my-profile/my-profile.module').then(
            (m) => m.MyProfileModule
          ),
      },
      {
        path: 'test-library',
        loadChildren: () =>
          import('../test-library/test-library.module').then(
            (m) => m.TestLibraryModule
          ),
      },
      {
        path: 'create-test',
        loadChildren: () =>
          import('../test-create/test-create.module').then(
            (m) => m.TestCreateModule
          ),
        resolve: {
          respondentOptions: RespondentOptionsResolver,
          countries: CountryResolver,
        },
        // canActivate: [AdminGuard],
      },
      {
        path: 'test-report',
        loadChildren: () =>
          import('../test-report/test-report.module').then(
            (module) => module.TestReportModule
          ),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('../invoices/invoices.module').then((m) => m.InvoicesModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'custom-segmentation',
        loadChildren: () =>
          import('../custom-segmentation/custom-segmentation.module').then(
            (m) => m.CustomSegmentationModule
          ),
      },
      {
        path: '**',
        redirectTo: 'my-profile',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'personal-area/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule { }
