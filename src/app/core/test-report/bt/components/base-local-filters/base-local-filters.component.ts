import { ChangeDetectionStrategy, Component, Injector, OnChanges } from '@angular/core';
import { BtMultiselectFilter } from '../../../../../shared/models/bt.test.report/bt.multiselect.filter.model';
import { FormGroup } from '@angular/forms';
import { BtReportStateService } from '../../bt.report.state.service';
import { LocalFiltersUtils } from '../../../../../shared/utils/test.report.local-filters.utils';
import { ListItem } from '../../../../../shared/models/test.model';
import { cloneDeep } from 'lodash';
import { BaseChartComponent } from '../../../bic/components/base-chart/base-chart.component';
import { BtStyleService } from '../../bt.style.service';

@Component({
  selector: 'app-base-local-filters',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseLocalFiltersComponent<T> extends BaseChartComponent<T> {
  public filterModel: BtMultiselectFilter[] = null;
  public filterForm: FormGroup = null;
  public kpi: ListItem[] = [];
  public lowNumbers = false;

  public service: BtReportStateService;
  public btStyle: BtStyleService;

  constructor(protected injector: Injector) {
    super(injector);
    this.service = injector.get(BtReportStateService);
    this.btStyle = injector.get(BtStyleService);
  }

  public initFilterModel(filterModel: BtMultiselectFilter[]): void {
    this.filterModel = cloneDeep(filterModel);
    this.setOptions();
    this.filterForm = LocalFiltersUtils.createForm(cloneDeep(this.filterModel));
    this.setInitialValues();
    this.applyFilters();
    this.cdr.detectChanges();
  }

  public applyFilters(): void {}

  public setOptions(): void {
    this._setSegmentsOptions();
    this._setBrands();
    this._setKPIs();
    this._setAssociations();
  }

  public setInitialValues(): void {
    this._setInitialBrand();
    this._setInitialSegments();
    this._setInitialKPIs();
    this._setInitialAssociations();
  }

  private _setSegmentsOptions(): void {
    const segmentsInd = this.filterModel.findIndex(item => item.formControlName === 'segments');
    const segments = this.service.segmentOptions.getValue();
    if (segmentsInd !== -1 && (!segments || !segments.length)) {
      this.filterModel.splice(segmentsInd, 1);
    } else {
      if (segmentsInd !== -1) {
        this.filterModel[segmentsInd].options = segments;
      }
    }
  }

  private _setBrands(): void {
    const brandsInd = this.filterModel.findIndex(item => item.formControlName === 'brands');
    if (brandsInd !== -1) {
      this.filterModel[brandsInd].options = (this.service as BtReportStateService).brands$.getValue();
    }
  }

  private _setAssociations(): void {
    const assocInd = this.filterModel.findIndex(item => item.formControlName === 'associations');
    if (assocInd !== -1) {
      this.filterModel[assocInd].options = (this.service as BtReportStateService).associations$.getValue();
    }
  }

  private _setKPIs(): void {
    const kpiInd = this.filterModel.findIndex(item => item.formControlName === 'kpis');
    if (kpiInd !== -1) {
      this.filterModel[kpiInd].options = this.kpi;
    }
  }

  private _setInitialBrand(): void {
    if (this.filterModel.find(item => item.formControlName === 'brands')?.isMulti) {
      this.filterForm.controls.brands?.setValue(
        LocalFiltersUtils.getAllItemsSelected((this.service as BtReportStateService).brands$.getValue())
      );
    } else {
      this.filterForm.controls.brands?.setValue((this.service as BtReportStateService).brand.value);
    }
  }

  private _setInitialSegments(): void {
    if (this.filterModel.find(item => item.formControlName === 'segments')?.isMulti) {
      this.filterForm.controls.segments?.setValue(LocalFiltersUtils.getAllItemsSelected(this.service.segmentOptions.getValue()));
    }
    if (this.filterModel.find(item => item.formControlName === 'segments')?.setFirst && this.service.segmentOptions.getValue()) {
      this.filterForm.controls.segments?.setValue(this.service.segmentOptions.getValue()[0].id);
    }
  }

  private _setInitialKPIs(): void {
    const kpiItem = this.filterModel.find(item => item.formControlName === 'kpis');
    if (kpiItem?.isMulti) {
      this.filterForm.controls.kpis?.setValue(LocalFiltersUtils.getAllKPIsSelected());
    }
    if (!kpiItem?.isMulti) {
      this.filterForm.controls.kpis?.setValue(kpiItem.options[0].id);
    }
  }

  private _setInitialAssociations(): void {
    const assocItem = this.filterModel.find(item => item.formControlName === 'associations');
    if (assocItem) {
      if (assocItem?.isMulti) {
        this.filterForm.controls.associations?.setValue(
          LocalFiltersUtils.getAllItemsSelected((this.service as BtReportStateService).associations$.getValue())
        );
      }
      if (!assocItem?.isMulti) {
        this.filterForm.controls.associations?.setValue((this.service as BtReportStateService).associations$.getValue()[0].id);
      }
    }
  }
}
