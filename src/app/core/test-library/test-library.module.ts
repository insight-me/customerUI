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
import { TestLibraryComponent } from './test-library.component';
import { TestLibraryRouting } from './test-library.routing';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { TestReportModule } from '../test-report/test-report.module';
import { BicModule } from '../test-report/bic/bic.module';
import { SharedReportComponentModule } from '../test-report/components/shared.report.component.module';
import { BtModule } from '../test-report/bt/bt.module';
import { NoTestsLibraryComponent } from './no-tests-library/no-tests-library.component';
import { LibraryActionComponent } from './components/library-action/library-action.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LibraryComponentsModule } from '../../shared/library-components/library-components.module';
import { ErrorMessageComponent } from './components/error-message/error-message.component';


const AppComponents = [
  TestLibraryComponent,
  NoTestsLibraryComponent,
  LibraryActionComponent,
];

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  SharedDirectivesModule,
  TestLibraryRouting,
  InputTextModule,
  DropdownModule,
  InputSwitchModule,
  RouterModule,
  ListboxModule,
  TooltipModule,
  SharedDialogsModule,
  SharedPipesModule,
  MatMenuModule,
  MatIconModule,

  TestReportModule,
  BicModule,
  BtModule,
  SharedReportComponentModule,
  LibraryComponentsModule
];

@NgModule({
  declarations: [ ...AppComponents, ErrorMessageComponent ],
  imports: [ ...AppModules ],
  exports: [],
})
export class TestLibraryModule {
}
