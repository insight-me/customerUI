import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SectionHeaderInfo } from '../../../../shared/models/main-page.model';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: [ './section-header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionHeaderComponent {
  @Input() sectionInfo: SectionHeaderInfo;
}
