import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../components/shared-components.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { SharedDialogsModule } from '../dialogs/shared-dialogs.module';
import { PrimengModule } from './primeng.module';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const shared = [
  CommonModule,
  SharedComponentsModule,
  SharedDirectivesModule,
  SharedDialogsModule,
  PrimengModule,
  SharedPipesModule,
  NgxChartsModule,
];

@NgModule({
  imports: [shared],
  exports: [shared]
})
export class SharedModule {}
