import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { LibraryActionsTabGroup } from 'src/app/shared/enums/library.type';
import { TAB_GROUP_ACTIONS } from '../../../../../assets/consts/test-library.consts';

export interface LibraryAction {
  name: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-library-action',
  templateUrl: './library-action.component.html',
  styleUrls: ['./library-action.component.scss']
})

export class LibraryActionComponent implements AfterViewInit {
  @Input() public actions: string[];
  @Input() public showDots = true;
  @Output() public deleteTest: EventEmitter<void> = new EventEmitter<void>();
  @Output() public copyTest: EventEmitter<void> = new EventEmitter<void>();
  @Output() public downloadPDF: EventEmitter<void> = new EventEmitter<void>();
  @Output() public downloadExcel: EventEmitter<void> = new EventEmitter<void>();
  @Output() public downloadCalculatedData: EventEmitter<void> = new EventEmitter<void>();
  @Output() public viewReport: EventEmitter<void> = new EventEmitter<void>();

  public tabGroup: LibraryAction[] = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.initTabGroup();
    this.cdr.detectChanges();
  }

  public onAction(name: string): void {
    switch (name) {
      case LibraryActionsTabGroup.Delete:
        this.deleteTest.emit();
        break;
      case LibraryActionsTabGroup.Copy:
        this.copyTest.emit();
        break;
      case LibraryActionsTabGroup.ExportPDF:
        this.downloadPDF.emit();
        break;
      case LibraryActionsTabGroup.ExportExcel:
        this.downloadExcel.emit();
        break;
      case LibraryActionsTabGroup.View:
        this.viewReport.emit();
        break;
      case LibraryActionsTabGroup.ExportCalcData:
        this.downloadCalculatedData.emit();
        break;
    }
  }

  private initTabGroup(): void {
    this.actions.forEach((act) => {
      this.tabGroup.push(TAB_GROUP_ACTIONS.find((action) => action.name === act));
    });
  }
}
