import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConnectionPositionPair, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { OVERLAY_POSITION_PAIRS } from '../../../../../assets/consts/bt.chart-local-filter.consts';
import { BtMultiselectFilter } from '../../../../shared/models/bt.test.report/bt.multiselect.filter.model';

@Component({
  selector: 'app-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
  animations: [
    trigger('overlay', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.1, 1)')]),
      transition(':leave', [animate('420ms cubic-bezier(0.88, 0, 0.86, 0.85)')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectFilterComponent implements OnChanges {
  @Input() public filterForm: FormGroup = null;
  @Input() public filterModel: BtMultiselectFilter[] = [];
  @Input() public allLabel = '';
  @Input() public needApplyBtn = true;
  @Input() public chartName: string;

  @Output() public applyFilters: EventEmitter<void> = new EventEmitter();

  public isFilterActive = false;
  public IconsType = IconsType;
  public positionPairs: ConnectionPositionPair[] = [...OVERLAY_POSITION_PAIRS];
  public scrollStrategy: ScrollStrategy;

  private _currentValue = null;
  private _initValue = null;

  constructor(private sso: ScrollStrategyOptions, private _cdRef: ChangeDetectorRef) {
    this.scrollStrategy = sso.block();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterForm) {
      this._initValue = cloneDeep(this.filterForm.getRawValue());
      this._currentValue = cloneDeep(this.filterForm.getRawValue());
      this._setKPIsMultiForm();
    }
  }

  public open(): void {
    this.isFilterActive = true;
  }

  public close(): void {
    this.isFilterActive = false;
  }

  public onBackdropClick(): void {
    if (this.needApplyBtn) {
      this._resetMulti(this._currentValue);
      this.filterForm.reset(this._currentValue);
      this.close();
    } else {
      this.onApply();
    }
  }

  public onReset(): void {
    this._resetMulti(this._initValue);
    this.filterForm.reset(this._initValue);
    this.onApply();
  }

  public onApply(): void {
    this._applyMulti();
    this._currentValue = cloneDeep(this.filterForm.getRawValue());
    this.applyFilters.emit();
    this.close();
  }

  public isSomeChecked(filters: any): boolean {
    return Object.values(filters).some((item: any) => item);
  }

  public checkAll(filterModelItem: BtMultiselectFilter): void {
    // tslint:disable-next-line: forin
    for (const key in filterModelItem.selected) {
      filterModelItem.selected[key] = true;
    }
    filterModelItem.isAll = true;
  }

  public toggle(value: string, filterModelItem: BtMultiselectFilter): void {
    if (value === 'all') {
      Object.keys(filterModelItem.selected).forEach(id => (filterModelItem.selected[id] = filterModelItem.isAll));
    }

    filterModelItem.isAll = Object.keys(filterModelItem.selected).every(id => !!filterModelItem.selected[id]);
  }

  private _setKPIsMultiForm(): void {
    this.filterModel.forEach(item => {
      if (item.isMulti) {
        item.selected = cloneDeep(this.filterForm.controls[item.formControlName].value);
        item.isAll = Object.values(item.selected).findIndex(isSelected => !isSelected) === -1;
      }
    });
  }

  private _resetMulti(resetedValue): void {
    this.filterModel.forEach(item => {
      if (item.isMulti) {
        item.selected = cloneDeep(resetedValue[item.formControlName]);
        item.isAll = Object.values(item.selected).findIndex(isSelected => !isSelected) === -1;
        this.filterForm.controls[item.formControlName].setValue(cloneDeep(item.selected));
      }
    });
  }

  private _applyMulti(): void {
    this.filterModel.forEach(item => {
      if (item.isMulti) {
        if (!Object.values(item.selected).find(isSelected => isSelected) && this.chartName !== 'performanceOverTime') {
          item.isAll = true;
          this.toggle('all', item);
        }

        this.filterForm.controls[item.formControlName].setValue(cloneDeep(item.selected));
      }

      if (this.chartName === 'performanceOverTime' && item.selected && Object.values(item.selected).every(el => !el)) {
        this.filterForm.controls['kpis'].setValue(this._aidedAwarenessByDefault().selected);
      }
    });
  }


  private _aidedAwarenessByDefault(): BtMultiselectFilter {
    const KPIs: BtMultiselectFilter = cloneDeep(this.filterModel.find(item => item.formControlName === 'kpis'));
    for (const key in KPIs.selected) {
      if (key === 'AidedAwareness') {
        KPIs.selected[key] = true;
      }
    }
    return KPIs;
  }
}
