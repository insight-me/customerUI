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
import { InvoicesRouting } from './invoices.routing';
import { InvoicesComponent } from './invoices.component';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { MatMenuModule } from '@angular/material/menu';
import { NoOrdersComponent } from './no-orders/no-orders.component';
import { LibraryComponentsModule } from '../../shared/library-components/library-components.module';

const AppComponents = [InvoicesComponent, NoOrdersComponent];

const AppModules = [
  CommonModule,
  SharedComponentsModule,
  SharedDirectivesModule,
  InvoicesRouting,
  InputTextModule,
  DropdownModule,
  InputSwitchModule,
  RouterModule,
  ListboxModule,
  TooltipModule,
  SharedDialogsModule,
  SharedPipesModule,
  LibraryComponentsModule,
];

@NgModule({
  declarations: [...AppComponents],
  imports: [...AppModules, MatMenuModule],
  exports: [],
})
export class InvoicesModule {}
