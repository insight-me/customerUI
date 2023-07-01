import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AssociationScoreDirective } from './association-score/association-score.directive';
import { ClickOutsideDirective } from './click-outside/click-outside.directive';
import { DateMaskDirective } from './date-mask/date-mask.directive';
import { DisabledControlDirective } from './disabled-control/disabled-control.directive';
import { DragDropDirective } from './drag-and-drop/drag-and-drop.directive';
import { FallbackSrcWidthDirective } from './fallback-src/fallback-src.directive';
import { DisableSwiperDirective } from './no-swipe/disable-swipe.directive';
import { RangePickerDirective } from './range-picker/range-picker.directive';
import { RerenderChartDirective } from './rerender-chart/rerender-chart.directive';
import { ResizeChartDirective } from './rerender-chart/resize-chart.directive';
import { ResizableDirective } from './resize/resize.directive';


const directives = [
  FallbackSrcWidthDirective,
  DragDropDirective,
  ResizableDirective,
  AssociationScoreDirective,
  DateMaskDirective,
  DisabledControlDirective,
  ClickOutsideDirective,
  RangePickerDirective,
  DisableSwiperDirective,
  RerenderChartDirective,
  ResizeChartDirective,
];
@NgModule({
  imports: [CommonModule],
  declarations: directives,
  exports: directives
})
export class SharedDirectivesModule { }
