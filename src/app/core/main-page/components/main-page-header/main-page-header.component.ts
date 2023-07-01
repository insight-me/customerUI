import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AppStateService } from '../../../../shared/services/app-state/app-state.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateLanguagesEnum } from 'src/app/shared/configs/translate.config';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { Router } from '@angular/router';
import { MainPageService } from '../../main-page.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-main-page-header',
  templateUrl: './main-page-header.component.html',
  styleUrls: ['./main-page-header.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageHeaderComponent implements OnInit {
  // @ViewChild('productMenuTrigger') productMenuTrigger: MatMenuTrigger;
  @ViewChild('companyMenuTrigger') companyMenuTrigger: MatMenuTrigger;

  @Output() public scrollTo: EventEmitter<number> = new EventEmitter<number>();

  @HostListener('window:scroll')
  private onScroll(): void {
    let scroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scroll > this._currentScrollPosition) {
      this.visibleHeader = false;
      this.closeMenu();
      this.closeMatMenu();
    } else {
      this.visibleHeader = true;
    }

    if (window.pageYOffset === 0) {
      this.visibleHeader = true;
    }
    this._currentScrollPosition = scroll;
  }

  @HostListener('window:resize')
  private onResize() {
    this._calculateMobileHeaderHeight();
  }

  private _currentScrollPosition: number = 0;

  public visibleHeader: boolean = true;
  public languages = [
    { lang: 'Swedish', value: 'SE' },
    { lang: 'English', value: 'EN' },
  ];
  public selectedLanguage;
  public year: number = new Date().getFullYear();

  public IconsType = IconsType;
  public isExpanded: boolean = false;
  public TranslateLanguagesEnum = TranslateLanguagesEnum;

  // public matMenuProductExpand: boolean = false;
  public matMenuCompanyExpand: boolean = false;

  public pageYOffset: number = 0;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private mainPageService: MainPageService
  ) {}

  public ngOnInit(): void {
    this.appStateService.language.subscribe((lang) => {
      const label = lang === 'en' ? 'English' : 'Swedish';
      this.selectedLanguage = { lang: label, value: lang.toUpperCase() };
    });
  }

  public toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
    this._calculateMobileHeaderHeight();
  }

  public closeMenu(): void {
    this.isExpanded = false;
  }

  public closeMatMenu(): void {
    // this.productMenuTrigger.closeMenu();
    this.companyMenuTrigger.closeMenu();
  }

  public navigateToContactUs(): void {
    this.mainPageService.scrollToContactUs$.next(true);
    if (this.router.url !== '/' && this.router.url !== '/products') {
      this.router.navigate(['/']);
    }
  }

  // public productMenuOpened(): void {
  //   this.matMenuProductExpand = true;
  // }

  // public productMenuClosed(): void {
  //   this.matMenuProductExpand = false;
  // }

  public companyMenuOpened(): void {
    this.matMenuCompanyExpand = true;
  }

  public companyMenuClosed(): void {
    this.matMenuCompanyExpand = false;
  }

  public onLogoClick(): void {
    this.closeMenu();
    this.closeMatMenu();
    this.router.navigate(['/']);
    this.scrollToTop();
  }

  public scrollToTop(): void {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }

  private _calculateMobileHeaderHeight(): void {
    const mobileHeaderMenu = document.getElementById(
      'app-start-page-mobile-header'
    );
    if (mobileHeaderMenu) {
      this.isExpanded
        ? (mobileHeaderMenu.style.height = window.innerHeight - 64 + 'px')
        : (mobileHeaderMenu.style.height = '0px');
    }
  }
}
