import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-change-company-address',
  templateUrl: './change-company-address.component.html',
  styleUrls: ['./change-company-address.component.scss'],
})
export class ChangeCompanyAddressComponent {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  public onClose(value: boolean): void {
    this.ref.close(value);
  }
}
