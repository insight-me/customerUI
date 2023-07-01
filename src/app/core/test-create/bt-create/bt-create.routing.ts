import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BtContainerComponent } from './components/bt-container/bt-container.component';
import { SectionOneComponent } from './pages/section-one/section-one.component';
import { SectionTwoComponent } from './pages/section-two/section-two.component';
import { SectionSevenComponent } from './pages/section-seven/section-seven.component';
import { SectionEightComponent } from './pages/section-eight/section-eight.component';
import { SectionThreeComponent } from './pages/section-three/section-three.component';
import { SectionFourComponent } from './pages/section-four/section-four.component';
import { SectionFiveComponent } from './pages/section-five/section-five.component';
import { SectionSixComponent } from './pages/section-six/section-six.component';

const routes: Routes = [
  {
    path: ':id',
    component: BtContainerComponent,
    children: [
      {
        path: 'section-1',
        component: SectionOneComponent,
      },
      {
        path: 'section-2',
        component: SectionTwoComponent,
      },
      {
        path: 'section-3',
        component: SectionThreeComponent,
      },
      {
        path: 'section-4',
        component: SectionFourComponent,
      },
      {
        path: 'section-5',
        component: SectionFiveComponent,
      },
      {
        path: 'section-6',
        component: SectionSixComponent,
      },
      {
        path: 'section-7',
        component: SectionSevenComponent,
      },
      {
        path: 'section-8',
        component: SectionEightComponent,
      },
      {
        path: '**',
        redirectTo: 'section-1',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BtCreateRouting {}
