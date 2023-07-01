import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestType } from '../../../../../shared/enums/product.id.type';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { BicCreateService } from '../../../bic-create/services/bic-create.service';
import { BtStateService } from '../../../bt-create/services/bt-state.service';

@Component({
  selector: 'app-next-button',
  templateUrl: './next-button.component.html',
  styleUrls: ['./next-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextButtonComponent {
  @Input() public nextSection = '';
  @Input() public buttonText = 'buttons.next';
  @Input() public testType: TestType;
  @Input() public styleBlue = '';

  constructor(private btTestCreateService: BtStateService, private createTestService: BicCreateService) {}

  public goTo(): void {
    if (this.testType === TestType.BT) {
      this.btTestCreateService.nextRoute$.next(this.nextSection);
    } else {
      this.createTestService.nextRoute.next(this.nextSection);
    }
  }

  public get IconsType(): typeof IconsType {
    return IconsType;
  }
}
