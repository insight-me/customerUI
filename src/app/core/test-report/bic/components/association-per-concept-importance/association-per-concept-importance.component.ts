import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import { BehaviorSubject } from 'rxjs';
import { ASSOCIATIONS_MULTI_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-association-per-concept-importance',
  templateUrl: './association-per-concept-importance.component.html',
  styleUrls: ['../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationPerConceptImportanceComponent extends BicLocalFiltersComponent<GroupedBarDataSet> implements OnChanges {
  @Input() public title = '';

  public dataSet$: BehaviorSubject<GroupedBarDataSet[]> = new BehaviorSubject<GroupedBarDataSet[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(ASSOCIATIONS_MULTI_LOCAL_FILTER);
    }
  }

  public getBackground(index: number, secondColorsSet: boolean): string {
    return TestReportUtils.getColor(index, secondColorsSet);
  }

  public applyFilters(): void {
    const { concepts, associations } = this.filterForm.getRawValue();
    if (this.dataSet.length) {
      const data = cloneDeep(this.dataSet).filter(item => associations[item.id]);
      data.forEach(item => (item.values = item.values.filter(concept => concepts[concept.id])));
      this.dataSet$.next(
        data.sort((a, b) => Math.max(...b.values.map(({ gamma }) => gamma)) - Math.max(...a.values.map(({ gamma }) => gamma)))
      );
    }
    this.cdr.markForCheck();
  }
}
