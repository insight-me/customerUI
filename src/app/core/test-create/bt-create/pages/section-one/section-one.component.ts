import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseSectionComponent } from '../base-section/base-section.component';

@Component({
  selector: 'app-section-one',
  templateUrl: './section-one.component.html',
  styleUrls: ['./section-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionOneComponent extends BaseSectionComponent {
  public currentSection = 'section-1';

  public updateGetIt(event: boolean): void {
    this.test.isAgreeSign = event;
  }

  public get checkIfHaveChanges(): boolean {
    return this.initTest?.isAgreeSign !== this.test?.isAgreeSign;
  }
}
