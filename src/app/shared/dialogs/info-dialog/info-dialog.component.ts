import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss', '../confirmation-dialog/confirmation-dialog.component.scss']
})
export class InfoDialogComponent {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  public onClose(): void {
    this.ref.close();
  }
}
