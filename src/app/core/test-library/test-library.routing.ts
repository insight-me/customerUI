import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestLibraryComponent } from './test-library.component';

const routes: Routes = [
  {
    path: '',
    component: TestLibraryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestLibraryRouting {}
