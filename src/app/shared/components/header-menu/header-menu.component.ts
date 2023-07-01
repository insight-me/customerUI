import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AppStateService } from '../../services/app-state/app-state.service';
import { LocalStorageService } from '../../services/app-state/local-storage.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  @Input() public theme = 'dark';
  public group = [];
  public user: User;
  public userName = '';
  private sub: Subscription = new Subscription();
  @ViewChild('op') panel: OverlayPanel;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appStateService: AppStateService,
    private localStorageService: LocalStorageService
  ) {}

  public ngOnInit(): void {
    this.getUserName();
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public setUserName(): void {
    this.userName = `${this.user?.firstName} ${this.user?.lastName}`;
  }

  public navigateTo(value: string): void {
    if (value === 'auth/login') {
      this.authService.logout().subscribe(() => {
        this.localStorageService.remove();
        this.authService.stopRefreshTokenTimer();
        this.appStateService.deleteCurrentUser();
        this.router.navigate([value]);
      });
    } else {
      this.router.navigate([value]);
    }
  }

  public moveTo(item): void {
    this.panel.hide();
    item.command();
  }

  public setMenuHeader(): void {
    this.group = [
      {
        label: 'header.library',
        command: () => {
          this.navigateTo('personal-area/test-library');
        },
      },
      {
        label: 'header.my-profile',
        command: () => {
          this.navigateTo('personal-area/my-profile/personal');
        },
      },
      {
        label: 'header.my-organization',
        command: () => {
          this.navigateTo('personal-area/my-profile/company');
        },
      },
      {
        label: 'header.log-out',
        user: this.userName,
        command: () => {
          this.navigateTo('auth/login');
        },
      },
    ];
    if (this.user.securityLevel !== 2) {
      this.group.splice(
        3,
        0,
        {
          label: 'header.settings',
          command: () => {
            this.navigateTo('personal-area/my-profile/settings');
          },
        },
        {
          label: 'header.my-segmentation',
          command: () => {
            this.navigateTo('personal-area/custom-segmentation');
          },
        },
        {
          label: 'invoices.Order Library',
          command: () => {
            this.navigateTo('personal-area/invoices');
          },
        }
      );
    }
  }

  private getUserName(): void {
    this.sub = this.appStateService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        this.setUserName();
        this.setMenuHeader();
      }
    });
  }
}
