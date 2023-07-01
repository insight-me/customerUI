import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SCROLL_DELAY } from '../../../../assets/consts/consts';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  @HostListener('window:scroll')
  public onScroll(): void {
    this._animateItems();
  }

  constructor(
    private router: Router,
    private meta: Meta,
    private translateService: TranslateService
  ) {
    this.meta.addTag({
      name: 'description',
      content: this.translateService.instant('landing.Meta description'),
    });
  }

  public ngOnInit(): void {
    this._animateItems();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        setTimeout(() => this._animateItems(), SCROLL_DELAY);
      }
    });
  }

  private _animateItems(): void {
    const animatedElements = document.querySelectorAll('.animated-item');
    if (animatedElements.length) {
      animatedElements.forEach((animItem: HTMLElement, i) => {
        const animItemHeight: number = animItem.offsetHeight;
        const animItemOffset: number = this._getOffset(animItem).top;
        const animStart = 4;

        let animItemPoint = window.innerHeight - animItemHeight / animStart;
        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }
        if (
          pageYOffset > animItemOffset - animItemPoint &&
          pageYOffset < animItemOffset + animItemHeight
        ) {
          animItem.classList.add('active');
        } else {
          animItem.classList.remove('active');
        }
      });
    }
  }

  private _getOffset(el): { top: number; left: number } {
    return {
      top:
        el.getBoundingClientRect().top + window.pageYOffset ||
        document.documentElement.scrollTop,
      left:
        el.getBoundingClientRect().left + window.pageXOffset ||
        document.documentElement.scrollLeft,
    };
  }
}
