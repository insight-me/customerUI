import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseSectionComponent } from '../base-section/base-section.component';

@Component({
  selector: 'app-section-eight',
  templateUrl: './section-eight.component.html',
  styleUrls: ['./section-eight.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionEightComponent extends BaseSectionComponent {
  public currentSection = 'section-8';
}
