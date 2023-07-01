import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ASSOCIATIONS_OVER_TIME_COMPARED_TO_COMPETITORS } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { cloneDeep } from 'lodash';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';

@Component({
  selector: 'app-bt-associations-compared-to-competitors',
  templateUrl: './bt-associations-compared-to-competitors.component.html',
  styleUrls: ['./bt-associations-compared-to-competitors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtAssociationsComparedToCompetitorsComponent extends BaseLocalFiltersComponent<BarDataSetModel> implements OnInit, OnChanges {
  @Input() public pdfVersion = false;

  public dataSet$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(protected injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.initFilterModel(ASSOCIATIONS_OVER_TIME_COMPARED_TO_COMPETITORS);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public applyFilters(): void {
    const { brands, segments, associations } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet).find(item => item.association.id === associations);
    data.dataset = data.dataset.filter(brand => brands[brand.id]);
    if (segments) {
      data.dataset = data.segmentDataset.find(segment => segment.segmentId === segments).data.filter(brand => brands[brand.id]);
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.dataSet$.next(data);
  }
}
