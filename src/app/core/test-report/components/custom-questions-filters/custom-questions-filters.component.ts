import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ONLY_SEGMENTS_LOCAL_FILTER, SINGLE_GRID_LOCAL_FILTER } from '../../../../../assets/consts/bt.chart-local-filter.consts';
import { cloneDeep } from 'lodash';
import { AnswerCustomQuestionType } from 'src/app/shared/enums/bic.custom-questions.type';
import { QuestionFeedback } from '../../../../shared/models/bic.test.report/additional.questions.model';
import { BarDataSetModel } from '../../../../shared/models/bic.test.report/bar.data.set.model';
import { BaseCustomQuestionFiltersComponent } from '../base-custom-question-filters/base-custom-question-filters.component';
import { TestType } from '../../../../shared/enums/product.id.type';
import { BIC_SINGLE_GRID_LOCAL_FILTER } from '../../../../../assets/consts/bic.report.local-filters.consts';
import { LocalFiltersUtils } from '../../../../shared/utils/test.report.local-filters.utils';

@Component({
  selector: 'app-custom-questions-filters',
  templateUrl: './custom-questions-filters.component.html',
  styleUrls: ['../../bic/components/concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomQuestionsFiltersComponent extends BaseCustomQuestionFiltersComponent<any> implements OnChanges {
  @Input() public currentQuestion: QuestionFeedback = null;
  @Input() public testType: TestType = null;

  public lowNumbers = false;

  private _initData: QuestionFeedback = null;

  @Output() public filterData: EventEmitter<BarDataSetModel[]> = new EventEmitter();
  @Output() public selectSegments: EventEmitter<boolean> = new EventEmitter();

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes.currentQuestion.currentValue && this.testType && !this._initData) || !this.filterModel) {
      this.setInitialFilter();
    }
    if (changes.currentQuestion.currentValue && this._initData && this.filterModel) {
      this._initData = cloneDeep(this.currentQuestion);
      this.applyFilters();
    }
  }

  public setInitialFilter(): void {
    this._initData = cloneDeep(this.currentQuestion);
    if (this.currentQuestion.answerType === AnswerCustomQuestionType.Grid) {
      this.initFilterModel(this.testType === TestType.BIC ? BIC_SINGLE_GRID_LOCAL_FILTER : SINGLE_GRID_LOCAL_FILTER);
    } else {
      this.initFilterModel(ONLY_SEGMENTS_LOCAL_FILTER);
    }
  }

  public setOptions(): void {
    super.setOptions();
    this._setCustomQuestionOptions();
  }

  public setInitialValues(): void {
    super.setInitialValues();
    this._setCustomQuestionOptionsInitialValue();
  }

  public resetQuestion(): void {
    this._initData = null;
    this.filterModel = null;
    this.filterForm = null;
  }

  public applyFilters(): void {
    const { options, segments } = this.filterForm.getRawValue();
    let data = options ? cloneDeep(this._initData).dataSet.filter(item => options[item.id]) : cloneDeep(this._initData).dataSet;
    if (options) {
      if (segments) {
        data.forEach(item => {
          item.gridData = item.segmentData.map(arr => arr.find(elem => elem.segmentId === segments));
        });
      }
    } else {
      if (segments) {
        data = cloneDeep(data.filter(item => item.segmentId === segments));
      } else {
        data = cloneDeep(data.filter(item => !item.segmentId));
      }
    }
    this.selectSegments.emit(segments);
    this.lowNumbers = this.testType === TestType.BT && this.reportCustomQuestionsService.getIntervalTotalsSegmentLow(segments);
    this.filterData.emit(data);
  }

  private _setCustomQuestionOptions(): void {
    const optionsInd = this.filterModel.findIndex(item => item.formControlName === 'options');
    if (optionsInd !== -1) {
      this.filterModel[optionsInd].options = cloneDeep(this.currentQuestion.rows);
    }
  }

  private _setCustomQuestionOptionsInitialValue(): void {
    const optionsItem = this.filterModel.find(item => item.formControlName === 'options');
    if (optionsItem?.isMulti) {
      this.filterForm.controls.options?.setValue(LocalFiltersUtils.getAllItemsSelected(cloneDeep(this.currentQuestion.rows)));
    }
  }
}
