import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { BehaviorSubject } from 'rxjs';
import { ASSOCIATIONS_SINGLE_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { cloneDeep } from 'lodash';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';

@Component({
  selector: 'app-association-per-concept',
  templateUrl: './association-per-concept.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationPerConceptComponent extends BicLocalFiltersComponent<GroupedBarDataSet> implements OnChanges {
  @Input() public title = '';

  public dataSet$: BehaviorSubject<GroupedBarDataSet[]> = new BehaviorSubject<GroupedBarDataSet[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(ASSOCIATIONS_SINGLE_LOCAL_FILTER);
    }
  }

  public getBackground(index: number, secondColorsSet: boolean): string {
    return TestReportUtils.getColor(index, secondColorsSet);
  }

  public applyFilters(): void {
    const { concepts, associations } = this.filterForm.getRawValue();
    if (this.dataSet.length) {
      const data = cloneDeep(this.dataSet).filter(item => associations[item.id]);
      data.forEach(item => (item.values = item.values.filter(concept => concept.id === concepts)));
      this.dataSet$.next(
        data.sort((a, b) => Math.max(...b.values.map(({ value }) => value)) - Math.max(...a.values.map(({ value }) => value)))
      );
    }
    this.cdr.markForCheck();
  }
}
