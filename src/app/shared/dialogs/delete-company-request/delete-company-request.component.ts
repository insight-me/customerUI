import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { CompanyService } from '../../services/company/company.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-delete-company-request',
  templateUrl: './delete-company-request.component.html',
  styleUrls: ['./delete-company-request.component.scss', '../confirmation-dialog/confirmation-dialog.component.scss'],
})
export class DeleteCompanyRequestDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private companyService: CompanyService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
  }

  public ngOnInit(): void {
    this.companyService.deleteCompanyInitial()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
      });
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public get formIsInvalid(): boolean {
    return this.form.invalid;
  }

  public onSubmit(): void {
    this.companyService
      .deleteCompany(this.config.data.id, this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res) => {
          this.ref.close(true);
          this.toastService.showMessage(
            'success',
            this.translateService.instant('my-profile.delete-account-success'),
            this.translateService.instant('my-profile.delete-company-success-deleted'),
          );
        },
        (err) => {
          this.toastService.showMessage(
            'warn',
            this.translateService.instant('t-toast.Failed'),
            err.error.title
          );
        }
      );
  }

  public controlHasError(control: string): boolean {
    const currentControl = this.form.controls[control] as FormControl;
    return currentControl.touched && currentControl.invalid;
  }

  private initForm(): void {
    this.form = this.fb.group({
      code: ['', Validators.required],
    });
  }

  public onClose(value: boolean): void {
    this.ref.close(value);
  }
}
