import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { PRODUCTS_HEADER } from '../../../../assets/consts/main-page.consts';
import { SectionHeaderInfo } from '../../../shared/models/main-page.model';
import { Subscription } from 'rxjs';
import { MainPageService } from '../main-page.service';
import { SCROLL_DELAY } from '../../../../assets/consts/consts';

@Component({
  selector: 'app-research-products-page',
  templateUrl: './research-products-page.component.html',
  styleUrls: ['./research-products-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchProductsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('productsContactUsRef') productsContactUsRef: ElementRef;
  public sectionInfo: SectionHeaderInfo = PRODUCTS_HEADER;

  private _subscription: Subscription = new Subscription();

  constructor(private mainPageService: MainPageService) {}

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
      top: this.productsContactUsRef.nativeElement.offsetTop,
      behavior: 'smooth',
    });
    this.mainPageService.scrollToContactUs$.next(false);
  }
}
