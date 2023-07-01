import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { BaseSectionComponent } from '../base-section/base-section.component';
import {
  BtCustomAssociation,
  BTTest,
  BtTestAssociation,
} from '../../../../../shared/models/bt-test.model';
import { Association } from '../../../../../shared/models/test.model';
import { takeUntil } from 'rxjs/operators';
import { DESKTOP_ARROW_SHIFT, MAX_ASSOCIATION_FOR_BT_TEST, MOBILE_ARROW_SHIFT } from '../../../../../../assets/consts/test-creation.const';
import { AddStatementAndAssociationDialogComponent } from '../../../../../shared/dialogs/add-statement-and-association-dialog/add-statement-and-association-dialog/add-statement-and-association-dialog.component';
import { ADD_ASSOCIATIONS } from '../../../../../../assets/consts/add-elements-in-test-dialog';
import { differenceBy } from 'lodash';
import { DESKTOP_VERSION, MOBILE_MAX_VERSION } from '../../../../../../assets/consts/consts';

@Component({
  selector: 'app-section-five',
  templateUrl: './section-five.component.html',
  styleUrls: [
    './section-five.component.scss',
    '../../../components/test-create-container/test-create-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFiveComponent
  extends BaseSectionComponent
  implements OnInit
{
  public currentSection = 'section-5';
  public customAssociations: BtCustomAssociation[] = [];
  public associations: Association[] = [];
  public selectedAssociations: BtTestAssociation[] = [];
  private _lang = 'EN';
  public editedAssociationIndex: number = null;
  public editedAssociation: Association = null;
  public marketArrowShiftBetween = 41;
  public changeDetectionRef: ChangeDetectorRef;
  public isTabletVersion = false;

  @HostListener('window:resize')
  private resize(): void {
    this._updateIsTablet();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this._updateIsTablet();
    this.appStateService.language
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((lang) => {
        this._lang = lang;
        this._getAssociations();
      });
  }

  public get checkIfHaveChanges(): boolean {
    return this._compareTest();
  }

  public setInitActions(): void {
    this.selectedAssociations = [...this.test.btTestAssociations];
    this.customAssociations = [...this.test.customAssociations];
    if (this._lang !== 'EN') {
      this.translateAssociations();
    }
  }

  public getIsDisabledButtons(): boolean {
    if (!this.associations.length) {
      return true;
    }
    return !differenceBy(this.associations, this.selectedAssociations, 'id')
      .length;
  }

  public updateCustomAssociations(associations: any[]): void {
    if (
      this.selectedAssociations.length + this.customAssociations.length + 1 <=
      MAX_ASSOCIATION_FOR_BT_TEST
    ) {
      this.customAssociations = associations;
      this.updateTest();
    }
  }

  public addAssociation(): void {
    if (!this.dialogService.dialogComponentRefMap.size) {
      const ref = this.dialogService.open(
        AddStatementAndAssociationDialogComponent,
        {
          showHeader: false,
          height: '100%',
          data: {
            allItems: differenceBy(
              this.associations,
              [...this.selectedAssociations, ...this.customAssociations],
              'id'
            ),
            associations: this.associations,
            dialogConfig: ADD_ASSOCIATIONS,
            maxItems:
              MAX_ASSOCIATION_FOR_BT_TEST -
              (this.selectedAssociations.length +
                this.customAssociations.length),
            isBT: true,
            max: MAX_ASSOCIATION_FOR_BT_TEST,
          },
        }
      );
      ref.onClose.subscribe((res) => {
        if (res) {
          this.selectedAssociations = this.selectedAssociations.concat(res);
          this.updateTest();
        }
      });
      this.dialogFactoryService.openDynamicDialogRefs.push(ref);
    }
  }

  public addAssociationFromList(association): void {
    this.selectedAssociations = this.selectedAssociations.concat(association);
    this.updateTest();
  }

  public removeAssociation(association: any): void {
    this.selectedAssociations = this.selectedAssociations.filter(
      (item) => item.id !== association.id
    );
    this.customAssociations = this.customAssociations.filter(
      (item) => item.value !== association.value
    );
    this.editedAssociationIndex = null;
    this.editedAssociation = null;
    this.updateTest();
  }

  public isCustomAssociation(association: string): boolean {
    return (
      this.associations.findIndex((assoc) => assoc.text === association) === -1
    );
  }

  public openEditMode(index: number, association: Association): void {
    this.editedAssociationIndex = index;
    this.editedAssociation = association;
  }

  public editAssociation(association: string): void {
    if (this.associations.find((assoc) => assoc.text === association)) {
      this.removeAssociation(this.editedAssociation);
      this.selectedAssociations.push(
        this.associations.find((assoc) => assoc.text === association)
      );
    } else {
      this.removeAssociation(this.editedAssociation);
      this.customAssociations.push({ value: association });
    }
    this.cancelEditMode();
    this.updateTest();
  }

  public cancelEditMode(): void {
    this.editedAssociationIndex = null;
    this.editedAssociation = null;
  }

  private translateAssociations(): void {
    const associations = [];
    if (this.selectedAssociations.length) {
      this.selectedAssociations.forEach((item) => {
        const swedenAssociations = this.associations.filter(
          (association) => association.id === item?.id
        )[0];
        associations.push(swedenAssociations);
      });
      this.selectedAssociations = associations;
    }
    this.cdr.detectChanges();
  }

  private updateTest(): void {
    this.test.btTestAssociations = this.selectedAssociations;
    this.test.customAssociations = this.customAssociations;
    this.cdr.detectChanges();
  }

  private _compareTest(): boolean {
    return (
      differenceBy(
        this.test?.btTestAssociations,
        this.initTest?.btTestAssociations,
        'id'
      ).length ||
      differenceBy(
        this.initTest?.customAssociations,
        this.test?.customAssociations,
        'value'
      ).length ||
      differenceBy(
        this.test?.customAssociations,
        this.initTest?.customAssociations,
        'value'
      ).length ||
      differenceBy(
        this.initTest?.btTestAssociations,
        this.test?.btTestAssociations,
        'id'
      ).length
    );
  }

  private _getAssociations(): void {
    this.btTestService
      .getAssociations()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((associations) => {
        this.associations = associations;
        if (this._lang !== 'EN' && this.test) {
          this.translateAssociations();
        }
        this.cdr.detectChanges();
      });
  }

  public associationsList(): (BtTestAssociation | BtCustomAssociation)[] {
    return [...this.selectedAssociations, ...this.customAssociations];
  }

  private _updateIsTablet(): void {
    this.isTabletVersion = window.innerWidth <= DESKTOP_VERSION;
    this.marketArrowShiftBetween =
      window.innerWidth < MOBILE_MAX_VERSION
        ? MOBILE_ARROW_SHIFT
        : DESKTOP_ARROW_SHIFT;
  }
}
