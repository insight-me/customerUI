import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MAX_MARK_KPI } from 'src/assets/consts/consts';

@Component({
  selector: 'app-custom-scale',
  templateUrl: './custom-scale.component.html',
  styleUrls: ['./custom-scale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomScaleComponent {
  @ViewChild('scale', { static: true }) public scale: ElementRef;
  @Input() public legendText: string[];
  public options: number[] = Array.from(Array(MAX_MARK_KPI).keys()).map(
    (item) => item + 1
  );
  constructor() { }
}
