import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { LegalComponent } from '../../../../shared/legal/legal/legal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogFactoryService } from '../../../../shared/services/dialog/dialog-factory.service';

@Component({
  selector: 'app-main-page-footer',
  templateUrl: './main-page-footer.component.html',
  providers: [ DialogService ],
  styleUrls: [ './main-page-footer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageFooterComponent {
  public IconsType = IconsType;

  constructor(
    private dialogService: DialogService,
    private dialogFactoryService: DialogFactoryService
  ) {
  }

  public openPP(isPrivacy: boolean, isTerms: boolean): void {
    if ( !this.dialogService.dialogComponentRefMap.size ) {
      const ref = this.dialogService.open(LegalComponent, {
        showHeader: false,
        height: '100%',
        data: {
          isPrivacy,
          isTerms,
        },
      });
      ref.onClose.subscribe(() => {
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public openMaps(): void {
    window.open(
      'http://maps.apple.com/maps?address=11,Biblioteksgatan,Stockholm'
    );
  }
}
