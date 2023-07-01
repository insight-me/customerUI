import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { MainPageService } from '../main-page.service';
import { SCROLL_DELAY } from '../../../../assets/consts/consts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contactUsSection') contactUsSection: ElementRef;

  private _subscription: Subscription = new Subscription();

  constructor(
    private configurationService: ConfigurationService,
    private mainPageService: MainPageService
  ) {}

  public ngOnInit(): void {
    localStorage.setItem('language', JSON.stringify('en'));
    this.configurationService.setLanguages();
  }

  public ngAfterViewInit(): void {
    this._subscription.add(
      this.mainPageService.scrollToContactUs$.subscribe({
        next: (isScroll) => {
          if (isScroll) {
            setTimeout(() => {
              this.scrollTo();
            }, SCROLL_DELAY);
          }
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public scrollTo(): void {
    window.scrollTo({
      top: this.contactUsSection.nativeElement.offsetTop,
      behavior: 'smooth',
    });
    this.mainPageService.scrollToContactUs$.next(false);
  }
}
