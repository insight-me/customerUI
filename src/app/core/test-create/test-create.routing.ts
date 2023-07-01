import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCreateContainerComponent } from './components/test-create-container/test-create-container.component';
import { PaidTestGuard } from '../../shared/guards/paid-test/paid-test.guard';

const routes: Routes = [
  {
    path: '',
    component: TestCreateContainerComponent,
    children: [
      {
        path: 'bic',
        loadChildren: () =>
          import('./bic-create/bic-create.module').then(
            (module) => module.BicCreateModule
          ),
        canActivate: [PaidTestGuard],
      },
      {
        path: 'bt',
        loadChildren: () =>
          import('./bt-create/bt-create.module').then(
            (module) => module.BtCreateModule
          ),
        canActivate: [PaidTestGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCreateRouting {}
