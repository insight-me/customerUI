import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { BaseChartComponent } from '../base-chart/base-chart.component';
import { BtMultiselectFilter } from '../../../../../shared/models/bt.test.report/bt.multiselect.filter.model';
import { FormGroup } from '@angular/forms';
import { LocalFiltersUtils } from '../../../../../shared/utils/test.report.local-filters.utils';
import { cloneDeep } from 'lodash';
import { BicReportStateService } from '../../bic.report.state.service';
import { KPITitle } from 'src/app/shared/models/bic.test.report/KPIModel';

@Component({
  selector: 'app-bic-local-filters',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BicLocalFiltersComponent<T> extends BaseChartComponent<T> {
  @Input() public tooltipTexts: string[] = [];
  @Input() public tooltipType = '';

  public filterModel: BtMultiselectFilter[] = null;
  public filterForm: FormGroup = null;
  public KPITitle = KPITitle;

  public bicRSS: BicReportStateService;

  constructor(protected injector: Injector) {
    super(injector);
    this.bicRSS = injector.get(BicReportStateService);
  }

  public initFilterModel(filterModel: BtMultiselectFilter[]): void {
    this.filterModel = cloneDeep(filterModel);
    this.setOptions();
    this.filterForm = LocalFiltersUtils.createForm(cloneDeep(this.filterModel));
    this.setInitialValues();
    this.applyFilters();
    this.cdr.detectChanges();
  }

  public setOptions(): void {
    this.setConcepts();
    this._setAssociations();
  }

  public applyFilters(): void {}

  public setInitialValues(): void {
    this._setInitialConcepts();
    this._setInitialAssociations();
  }

  public setConcepts(): void {
    const conceptInd = this.filterModel.findIndex(item => item.formControlName === 'concepts');
    if (conceptInd !== -1) {
      this.filterModel[conceptInd].options = this.bicRSS.concepts.value.map(item => {
        return { ...item, value: item.conceptName };
      });
    }
  }

  private _setAssociations(): void {
    const assocInd = this.filterModel.findIndex(item => item.formControlName === 'associations');
    if (assocInd !== -1) {
      this.filterModel[assocInd].options = this.bicRSS.associations$.getValue();
    }
  }

  private _setInitialConcepts(): void {
    const conceptItem = this.filterModel.find(item => item.formControlName === 'concepts');
    if (conceptItem) {
      if (conceptItem?.isMulti) {
        this.filterForm.controls.concepts?.setValue(LocalFiltersUtils.getAllItemsSelected(this.bicRSS.concepts.value));
      } else {
        this.filterForm.controls.concepts?.setValue(this.bicRSS.concepts.value[0].id);
      }
    }
  }

  private _setInitialAssociations(): void {
    const assocItem = this.filterModel.find(item => item.formControlName === 'associations');
    if (assocItem) {
      if (assocItem?.isMulti) {
        this.filterForm.controls.associations?.setValue(
          LocalFiltersUtils.getAllItemsSelected(this.bicRSS.associations$.getValue())
        );
      }
      if (!assocItem?.isMulti) {
        this.filterForm.controls.associations?.setValue(this.bicRSS.associations$.getValue()[0].id);
      }
    }
  }
}
