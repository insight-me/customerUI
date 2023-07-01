import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_MODULE_CONFIG } from '../configs/translate.config';
import { SharedComponentsModule } from '../components/shared-components.module';
import { DeleteCompanyRequestDialogComponent } from './delete-company-request/delete-company-request.component';
import { InviteNewUserDialogComponent } from './invite-new-user-dialog/invite-new-user-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { InputTextModule } from 'primeng/inputtext';
import { AddStatementAndAssociationDialogComponent } from './add-statement-and-association-dialog/add-statement-and-association-dialog/add-statement-and-association-dialog.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { ChangePermissionDialogComponent } from './change-permission-dialog/change-permission-dialog.component';

const commonModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  DynamicDialogModule,
];

const commonDeclarations = [
  ConfirmationDialogComponent,
  DeleteCompanyRequestDialogComponent,
  InviteNewUserDialogComponent,
];

@NgModule({
  imports: [
    SharedComponentsModule,
    DropdownModule,
    TableModule,
    TreeTableModule,
    InputTextModule,
    TranslateModule.forChild(TRANSLATE_MODULE_CONFIG),
    ...commonModules,
  ],
  declarations: [...commonDeclarations, AddStatementAndAssociationDialogComponent, InfoDialogComponent, ChangePermissionDialogComponent],
  providers: [],
  exports: [...commonModules, ...commonDeclarations],
  entryComponents: [...commonDeclarations],
})
export class SharedDialogsModule {}
