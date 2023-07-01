import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ErrorStatusCode } from '../../../shared/enums/responce-status.type';
import { ToastType } from '../../../shared/enums/toast.type';

interface EmailCodeData {
  email: string;
  code: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  private _emailCodeData: EmailCodeData = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this._getEmailAndCode();
  }

  public submitForm(password: string): void {
    const payload = {
      password,
      ...this._emailCodeData,
    };
    this.authService.passwordResetComplete(payload).subscribe({
      next: () => {
        this.toastService.showMessage(
          ToastType.Success,
          this.translateService.instant(
            't-auth.Password was successfully updated.'
          ),
          ''
        );
        this._navigateToLogin();
      },
    });
  }

  private _getEmailAndCode(): void {
    this._emailCodeData = {
      email: this.route.snapshot.queryParams.Email,
      code: this.route.snapshot.queryParams.Code,
    };
    this._confirmResetPassword();
  }

  private _confirmResetPassword(): void {
    this.authService.passwordResetConfirm(this._emailCodeData).subscribe({
      next: () => {},
      error: (err) => {
        const errorTitle =
          err.status === ErrorStatusCode.NotFound
            ? this.translateService.instant('t-auth.Login failed.')
            : '';
        const errorText =
          err.status === ErrorStatusCode.NotFound
            ? this.translateService.instant('t-auth.Login failed.')
            : this.translateService.instant(
                't-auth.There was an unknown error. Please, try again.'
              );
        this.toastService.showMessage(ToastType.Warning, errorTitle, errorText);
        this._navigateToLogin();
      },
    });
  }

  private _navigateToLogin(): void {
    this.router.navigate(['auth', 'login']);
  }
}
