import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Test, TestConcept } from 'src/app/shared/models/test.model';
import { TranslateService } from '@ngx-translate/core';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { DialogFactoryService } from '../../../../../shared/services/dialog/dialog-factory.service';
import { ConfirmationDialogComponent } from '../../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-bic-header',
  templateUrl: './bic-header.component.html',
  styleUrls: ['./bic-header.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BicHeaderComponent {
  @Input() test: Test = null;
  @Input() concept: TestConcept = null;

  @Output() changedCurrentConcept: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() deletedConcept: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public dialogService: DialogService,
    public translateService: TranslateService,
    public dialogFactoryService: DialogFactoryService
  ) {}

  public get IconsType(): typeof IconsType {
    return IconsType;
  }

  public isSelectedConcept(conceptName: string): boolean {
    return conceptName === this.concept.conceptName;
  }

  public onChangeCurrentConcept(conceptId: string): void {
    this.changedCurrentConcept.emit(conceptId);
  }

  public onOpenDialog(conceptId: string): void {
    const conceptIdForDelete = this.test.concepts.find(
      (concept) => concept.id === conceptId
    );
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(ConfirmationDialogComponent, {
        showHeader: false,
        data: {
          header: this.translateService.instant('t-concept.Delete concept'),
          text: this.translateService.instant(
            't-concept.Are you sure you want to delete concept?',
            { name: conceptIdForDelete.conceptName }
          ),
        },
      });
      ref.onClose.subscribe((res) => {
        if (res) {
          if (this.test.concepts.length === 1) {
            return;
          }
          this.deletedConcept.emit(conceptIdForDelete.id);
        }
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }
}
