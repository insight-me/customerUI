import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConceptScorePerSegmentModel } from '../../../../../shared/models/bic.test.report/concept.score.per.segment.model';
import { CONCEPT_LOCAL_FILTER } from '../../../../../../assets/consts/bic.report.local-filters.consts';
import { BicLocalFiltersComponent } from '../bic-local-filters/bic-local-filters.component';
import { cloneDeep } from 'lodash';
import { KPIModel, KPITitle } from '../../../../../shared/models/bic.test.report/KPIModel';

@Component({
  selector: 'app-kpi-score-per-concept',
  templateUrl: './kpi-score-per-concept.component.html',
  styleUrls: ['./kpi-score-per-concept.component.scss', '../concept-definitions/concept-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiScorePerConceptComponent extends BicLocalFiltersComponent<ConceptScorePerSegmentModel> implements OnChanges {
  @Input() public title = '';
  @Input() public kpi: Map<KPITitle, KPIModel>;

  public tableRows: KPITitle[] = [];
  public kpisTitles: KPITitle[] = [
    KPITitle.Likeability,
    KPITitle.PurchaseIntent,
    KPITitle.PurchaseFrequency,
    KPITitle.CurrentBrandLikeability,
    KPITitle.Uniqueness,
    KPITitle.Relevance,
    KPITitle.Trustworthiness,
    KPITitle.Brandfit,
  ];
  public dataSet$: BehaviorSubject<ConceptScorePerSegmentModel[]> = new BehaviorSubject<ConceptScorePerSegmentModel[]>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && !this.filterModel) {
      this.initFilterModel(CONCEPT_LOCAL_FILTER);
    }
    if (changes.kpi.currentValue && !this.tableRows.length) {
      this.tableRows = this.kpisTitles.filter(el => this.kpi.has(el));
      this.cdr.markForCheck();
    }
  }

  public applyFilters(): void {
    const { concepts } = this.filterForm.getRawValue();
    if (this.dataSet) {
      this.dataSet$.next(cloneDeep(this.dataSet).filter(item => concepts[item.id]));
    }
    this.cdr.markForCheck();
  }
}
