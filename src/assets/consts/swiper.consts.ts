import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SwiperOptions } from 'swiper';

export const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

export const SUBHEADER_SWIPER_CONFIG: SwiperOptions = {
  slidesPerView: 'auto',
  spaceBetween: 5,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: false,
  scrollbar: false,
};

export const MAIN_PAGE_SWIPER_CONFIG: SwiperOptions = {
  slidesPerView: 'auto',
  spaceBetween: 40,
  navigation: false,
  pagination: false,
  scrollbar: false,
};

export const REPORT_SUBHEADER_SWIPER_CONFIG: SwiperOptions = {
  slidesPerView: 'auto',
  spaceBetween: 0,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: false,
  scrollbar: false,
};

export const GRID_TABLE_SWIPER_CONFIG: SwiperOptions = {
  spaceBetween: 0,
  navigation: false,
  pagination: { el: '.swiper-pagination.pagination-test', type: 'fraction' },
  scrollbar: false,
};
