import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { BtMultiselectFilter } from '../../../../shared/models/bt.test.report/bt.multiselect.filter.model';
import { FormGroup } from '@angular/forms';
import { ReportCustomQuestionsService } from '../../report.custom-questions.service';
import { Test } from '../../../../shared/models/test.model';
import { BTTest } from '../../../../shared/models/bt-test.model';
import { LocalFiltersUtils } from '../../../../shared/utils/test.report.local-filters.utils';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-base-custom-question-filters',
  templateUrl: './base-custom-question-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseCustomQuestionFiltersComponent<T extends Test | BTTest> {
  public filterModel: BtMultiselectFilter[] = null;
  public filterForm: FormGroup = null;

  public reportCustomQuestionsService: ReportCustomQuestionsService<T>;
  public cdr: ChangeDetectorRef;
  constructor(protected injector: Injector) {
    this.reportCustomQuestionsService = injector.get(ReportCustomQuestionsService);
    this.cdr = injector.get(ChangeDetectorRef);
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
    this._setConcepts();
    this._setSegmentsOptions();
  }

  public setInitialValues(): void {
    this._setInitialConcepts();
    this._setInitialSegments();
  }

  private _setConcepts(): void {
    const conceptInd = this.filterModel.findIndex(item => item.formControlName === 'concepts');
    if (conceptInd !== -1) {
      this.filterModel[conceptInd].options = (this.reportCustomQuestionsService.test as Test).concepts.map(item => {
        return { ...item, value: item.conceptName };
      });
    }
  }

  private _setInitialConcepts(): void {
    const conceptItem = this.filterModel.find(item => item.formControlName === 'concepts');
    if (conceptItem) {
      this.filterForm.controls.concepts?.setValue((this.reportCustomQuestionsService.test as Test).concepts[0].id);
    }
  }

  private _setSegmentsOptions(): void {
    const segmentsInd = this.filterModel.findIndex(item => item.formControlName === 'segments');
    const segments = this.reportCustomQuestionsService.segmentOptions$.getValue();
    if (segmentsInd !== -1 && (!segments || !segments.length)) {
      this.filterModel.splice(segmentsInd, 1);
    } else {
      if (segmentsInd !== -1) {
        this.filterModel[segmentsInd].options = segments;
      }
    }
  }

  private _setInitialSegments(): void {
    if (this.filterModel.find(item => item.formControlName === 'segments')?.isMulti) {
      this.filterForm.controls.segments?.setValue(
        LocalFiltersUtils.getAllItemsSelected(this.reportCustomQuestionsService.segmentOptions$.getValue())
      );
    }
    if (
      this.filterModel.find(item => item.formControlName === 'segments')?.setFirst &&
      this.reportCustomQuestionsService.segmentOptions$.getValue()
    ) {
      this.filterForm.controls.segments?.setValue(this.reportCustomQuestionsService.segmentOptions$.getValue()[0].id);
    }
  }
}
