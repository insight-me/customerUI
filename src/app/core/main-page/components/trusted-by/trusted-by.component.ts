import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { MAIN_PAGE_SWIPER_CONFIG } from '../../../../../assets/consts/swiper.consts';

@Component({
  selector: 'app-trusted-by',
  templateUrl: './trusted-by.component.html',
  styleUrls: [ './trusted-by.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrustedByComponent {
  public images: string[] = [
    'assets/images/page_5_1.jpg',
    'assets/images/page_5_2.jpg',
    'assets/images/page_5_3.jpg',
    'assets/images/page_5_4.jpg',
    'assets/images/page_5_5.jpg',
    'assets/images/page_5_6.jpg',
    'assets/images/page_5_7.jpg',
    'assets/images/page_5_8.jpg',
    'assets/images/page_5_9.jpg',
  ];
  public swiperConfig: SwiperOptions = MAIN_PAGE_SWIPER_CONFIG;

  @Output() onGetDemo: EventEmitter<void> = new EventEmitter();

  constructor() {
  }
}
