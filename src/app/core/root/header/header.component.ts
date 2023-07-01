import { Router } from '@angular/router';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/services/app-state/local-storage.service';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { FormBuilder } from '@angular/forms';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { RoleType, User } from 'src/app/shared/models/user.model';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogFactoryService } from 'src/app/shared/services/dialog/dialog-factory.service';
import { Location } from '@angular/common';
import { TranslateLanguagesEnum } from '../../../shared/configs/translate.config';
import { IconsType } from '../../../shared/enums/icons.type';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isDashboardMode = false;

  @ViewChild('burger') public burger: ElementRef;

  public languages = [
    { lang: 'SE', value: 'SE' },
    { lang: 'EN', value: 'EN' },
  ];
  public selectedLanguage;
  public currentUser: User;
  public userName = '';

  private isVisibleMenu = false;
  protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private appStateService: AppStateService,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private dialogFactoryService: DialogFactoryService,
    private fb: FormBuilder,
    private location: Location,
    private configurationService: ConfigurationService,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.appStateService.user
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.setUserName();
          const currentLang = JSON.parse(localStorage.getItem('language'));
          if (currentLang) {
            this.selectedLanguage = {
              lang: currentLang.toUpperCase(),
              value: currentLang.toUpperCase(),
            };
          }
        }
      });
    this.appStateService.language
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((lang) => {
        this.selectedLanguage = {
          lang: lang.toUpperCase(),
          value: lang.toUpperCase(),
        };
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public setUserName(): void {
    this.userName = `${this.currentUser?.firstName} ${this.currentUser?.lastName}`;
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public get userEmail(): string {
    return `${this.currentUser?.firstName} ${this.currentUser?.lastName}`;
  }

  public get isNotManager(): boolean {
    return this.currentUser?.securityLevel !== RoleType.Manager;
  }

  public get LanguageEnum(): typeof TranslateLanguagesEnum {
    return TranslateLanguagesEnum;
  }

  public onChangeLanguage(): void {
    this.appStateService.changeLanguage(
      this.selectedLanguage.value.toLowerCase()
    );
  }

  public openMenu(): void {
    this.isVisibleMenu = !this.isVisibleMenu;
    if (this.isVisibleMenu) {
      this.renderer.addClass(this.burger.nativeElement, 'visible');
    } else {
      this.renderer.removeClass(this.burger.nativeElement, 'visible');
    }
  }

  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.localStorageService.remove();
      this.authService.stopRefreshTokenTimer();
      this.appStateService.deleteCurrentUser();
      this.router.navigate(['auth/login']);
    });
  }
}
