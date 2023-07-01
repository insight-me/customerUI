import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogFactoryService } from '../../../shared/services/dialog/dialog-factory.service';
import { LegalComponent } from '../../../shared/legal/legal/legal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DialogService],
})
export class FooterComponent {
  constructor(
    private dialogService: DialogService,
    private dialogFactoryService: DialogFactoryService
  ) {}

  public openPP(isPrivacy: boolean, isTerms: boolean): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(LegalComponent, {
        showHeader: false,
        height: '100%',
        data: {
          isPrivacy,
          isTerms,
        },
      });
      ref.onClose.subscribe(() => {});
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }
}
