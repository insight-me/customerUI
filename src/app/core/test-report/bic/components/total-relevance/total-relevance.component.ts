import { Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { TotalRelevanceModel } from '../../../../../shared/models/bic.test.report/total.relevance.model';
import { RELEVANCE_COLORS } from '../../../../../../assets/consts/consts';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { TOTAL_RELEVANCE_TEXT } from '../../../../../../assets/consts/graph-tooltip-texts.const';
import { TotalRelevanceType } from '../../../../../shared/enums/bic.report.relevance.type';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { CONCEPT_LOCAL_FILTER_SINGLE } from '../../../../../../assets/consts/bic.report.local-filters.consts';

@Component({
  selector: 'app-total-relevance',
  templateUrl: './total-relevance.component.html',
  styleUrls: [
    './total-relevance.component.scss',
    '../../../components/vertical-bar-chart/vertical-bar-chart.component.scss',
    '../../../components/multi-grid-chart/multi-grid-chart.component.scss',
    '../concept-definitions/concept-definitions.component.scss'
  ]
})
export class TotalRelevanceComponent extends BicLocalFiltersComponent<TotalRelevanceModel> implements OnChanges {
  public horizontalAxis: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public Math = Math;
  public IconsType = IconsType;
  public dataSet$: BehaviorSubject<TotalRelevanceModel> = new BehaviorSubject<TotalRelevanceModel>(null);
  public conceptData: TotalRelevanceModel = null;
  public tooltipTexts: string[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER_SINGLE);
    }
  }

  public getBackground(index: number): string {
    return RELEVANCE_COLORS[index];
  }

  public getTotalRelevanceTexts(): void {
    const totalRelevanceTexts: string[] = [...TOTAL_RELEVANCE_TEXT];
    if (this.conceptData?.dataSet.find(el => el.type === TotalRelevanceType.Benefit)) {
      totalRelevanceTexts.push('report.How relevant do you think the benefits of the idea are?');
    }
    if (this.conceptData?.dataSet.find(el => el.type === TotalRelevanceType.ReasonsToBelieve)) {
      totalRelevanceTexts.push('report.How relevant do you think the reasons to believe in the idea are?');
    }
    this.tooltipTexts = totalRelevanceTexts;
  }

  public applyFilters(): void {
    const { concepts } = this.filterForm.getRawValue();
    if (this.dataSet) {
      this.conceptData = cloneDeep(this.dataSet).filter(item => item.concept.id === concepts)[0];
      this.dataSet$.next(this.conceptData);
      this.getTotalRelevanceTexts();
    }
    this.cdr.markForCheck();
  }
}
