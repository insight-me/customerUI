import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssociationType, StatementType, } from 'src/app/shared/models/test.model';
import { differenceWith, intersectionWith, isEqual, orderBy, uniqBy } from 'lodash';
import { ADD_ASSOCIATIONS, ADD_STATEMENTS, } from 'src/assets/consts/add-elements-in-test-dialog';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-statement-and-association-dialog',
  templateUrl: './add-statement-and-association-dialog.component.html',
  styleUrls: ['./add-statement-and-association-dialog.component.scss', '../../confirmation-dialog/confirmation-dialog.component.scss'],
})
export class AddStatementAndAssociationDialogComponent implements OnInit {
  public dialogConfig: any;
  public allItems = [];
  public selectedItems: any[];
  public defaultItems: any[];
  public maxItems: number;
  public index;
  public isBT = false;
  public searchText;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toastService: ToastService,
    public translateService: TranslateService
  ) {
  }

  public ngOnInit(): void {
    if (this.config.data?.dialogConfig?.name === ADD_ASSOCIATIONS.name) {
      this.allItems =
        orderBy(this.config.data?.allItems, ['type'], ['desc']) || [];
    } else {
      this.allItems = this.config.data?.allItems;
    }
    this.isBT = this.config.data?.isBT;
    this.index = this.allItems.findIndex((item) => item.type === 1);
    this.defaultItems = this.config.data?.defaultItems || [];
    this.selectedItems = this.config.data?.selectedItems || [];
    this.dialogConfig = this.config.data?.dialogConfig;
    this.maxItems = this.config.data?.maxItems;
  }

  public get statementEnum(): any {
    if (this.dialogConfig.name === ADD_STATEMENTS.name) {
      return StatementType;
    }
    return AssociationType;
  }

  public onClose(value: any): void {
    if (value.length > this.maxItems) {
      if (this.config.data?.max - this.maxItems > 0) {
        if (this.config.data?.max - this.maxItems === 1) {
          this.toastService.showMessage(
            'error',
            this.translateService.instant('associations.error-max-selected-one', {
              type: 'associations',
              max: this.config.data?.max,
            }),
            ''
          );
        } else {
          this.toastService.showMessage(
            'error',
            this.translateService.instant('associations.error-max-selected', {
              type: 'associations',
              max: this.config.data?.max,
              selected: this.config.data?.max - this.maxItems
            }),
            ''
          );
        }
      } else {
        this.toastService.showMessage(
          'error',
          this.translateService.instant('associations.error-max-selected-zero', {
            type: 'associations',
            max: this.config.data?.max,
          }),
          ''
        );
      }

      return;
    } else {
      this.ref.close(value);
    }
  }

  public checkIsSelectedAllByType(type: number): boolean {
    return intersectionWith(this.selectedItems, this.allItems.filter((item) => {
      return item.type === type;
    }), isEqual).length === this.allItems.filter((item) => {
      return item.type === type;
    }).length;
  }

  public removeAllByType(type: number): void {
    this.selectedItems = differenceWith(this.selectedItems, this.allItems.filter((item) => {
      return item.type === type;
    }), isEqual);
  }

  public addItemsByType(type: number): void {
    const itemToCheck = this.allItems.filter((item) => {
      return item.type === type;
    });
    this.selectedItems = this.selectedItems.concat(itemToCheck);
    this.selectedItems = uniqBy(this.selectedItems, 'text');
  }

  public getAssociationsByType(type: number): any[] {
    return this.allItems.filter((item) => {
      return item.type === type;
    });
  }

  public addAllData(): void {
    this.selectedItems = this.selectedItems.concat(this.allItems);
    this.selectedItems = uniqBy(this.selectedItems, 'text');
  }

  public removeAllData(): void {
    this.selectedItems = differenceWith(this.selectedItems, this.allItems, isEqual);
  }
}
