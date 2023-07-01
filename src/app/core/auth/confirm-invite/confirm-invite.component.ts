import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from '../../../shared/enums/toast.type';

interface IDCodeData {
  id: string;
  confirmationCode: string;
}

@Component({
  selector: 'app-confirm-invite',
  templateUrl: './confirm-invite.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmInviteComponent implements OnInit {
  private _idCodeData: IDCodeData = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this._getIdCodeData();
  }

  public submitForm(password: string): void {
    const payload = {
      password,
      confirmPassword: password,
      ...this._idCodeData,
    };
    this.authService.setInviteUserPassword(payload).subscribe({
      next: () => {
        this.toastService.showMessage(
          ToastType.Success,
          this.translateService.instant('t-auth.Successfully submitted.'),
          this.translateService.instant(
            't-auth.E-mail is successfully confirmed.'
          )
        );
        this._navigateToLogin();
      },
      error: (err) => {
        this.toastService.showMessage(
          ToastType.Warning,
          this.translateService.instant('t-auth.Confirmation failed.'),
          err.error.title
        );
        this._navigateToLogin();
      },
    });
  }

  private _getIdCodeData(): void {
    this._idCodeData = {
      id: this.route.snapshot.queryParams.Id,
      confirmationCode: this.route.snapshot.queryParams.ConfirmationCode,
    };
    this._confirmInvitationLink();
  }

  private _confirmInvitationLink(): void {
    this.authService.checkInvitationLink(this._idCodeData.id).subscribe({
      next: (res) => {
        if (!res) {
          this.toastService.showMessage(
            ToastType.Warning,
            this.translateService.instant('t-auth.Confirmation failed.'),
            this.translateService.instant('t-auth.The link has expired.')
          );
          this._navigateToLogin();
        }
      },
      error: (err) => {
        this.toastService.showMessage(ToastType.Warning, '', err.error.message);
      },
    });
  }

  private _navigateToLogin(): void {
    this.router.navigate(['auth', 'login']);
  }
}
