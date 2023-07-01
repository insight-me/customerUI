import { Injectable } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class DialogFactoryService {
  // define a variable to push the references to
  public openDynamicDialogRefs: DynamicDialogRef[] = [];

  // function that destroys all existing dialogs
  public closeOpenDialogs(): void {
    this.openDynamicDialogRefs.forEach((openDynamicDialogRef: DynamicDialogRef) => openDynamicDialogRef.destroy());
    this.openDynamicDialogRefs = [];
  }
}

