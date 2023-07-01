import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-permission-dialog',
  templateUrl: './change-permission-dialog.component.html',
  styleUrls: ['./change-permission-dialog.component.scss', '../confirmation-dialog/confirmation-dialog.component.scss']
})
export class ChangePermissionDialogComponent implements OnInit {
  public permissionControl: FormControl;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,
              private fb: FormBuilder) {
  }

  public ngOnInit(): void {
    this.permissionControl = this.fb.control(null, Validators.required);
  }

  public onClose(value: boolean): void {
    if (value) {
      this.ref.close({ value: this.permissionControl.value.value });
    } else {
      this.ref.close(value);
    }
  }
}
