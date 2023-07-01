import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { format, parseISO } from 'date-fns';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzCalendarModeMap } from 'src/app/shared/enums/nz-range.type';
import { penetrationTitle } from 'src/app/shared/helpers/penetration-title';
import { calcFirstDateValue, calcLastDateValue } from 'src/app/shared/utils/date.utils';
import { SCORE_CARD_LOCAL_FILTER } from '../../../../../../assets/consts/bt.chart-local-filter.consts';
import { KPI_NAME } from '../../../../../../assets/consts/consts';
import { IconsType } from '../../../../../shared/enums/icons.type';
import { KPITitle } from '../../../../../shared/models/bic.test.report/KPIModel';
import { BtHealthOverviewDataset, KpiDifference } from '../../../../../shared/models/bt.test.report/bt.health.overview.dataset.model';
import { InlineStyleModel } from '../../../../../shared/models/inline.style.model';
import { BtStyleService } from '../../bt.style.service';
import { BaseLocalFiltersComponent } from '../base-local-filters/base-local-filters.component';
import { GlobalFilterService } from '../global-filter.service';

const ARROWS = {
  [KpiDifference.Improved]: IconsType.UpArrow,
  [KpiDifference.Lower]: IconsType.DownArrow,
  [KpiDifference.Same]: IconsType.HorizontalArrow,
};

const KPI_COLORS = {
  [KPITitle.SpontaneousAwareness]: '#F9EF9A',
  [KPITitle.TopOfMindSpontaneousAwareness]: '#FFA56F',
  [KPITitle.AidedAwareness]: '#F7C8D0',
  [KPITitle.Consideration]: '#B8B2EA',
  [KPITitle.Preference]: '#ADD9F4',
  [KPITitle.Penetration]: '#AFEBAB',
  [KPITitle.ToggleSpontaneousAwareness]: '#F9EF9A',
  [KPITitle.ToggleTopOfMindSpontaneousAwareness]: '#FFA56F',
  [KPITitle.ToggleAidedAwareness]: '#F7C8D0',
  [KPITitle.ToggleConsideration]: '#B8B2EA',
  [KPITitle.TogglePreference]: '#ADD9F4',
  [KPITitle.TogglePenetration]: '#AFEBAB',
};

const NO_SEGMENT_DATA = {
  aidedAwareness: 0,
  considerations: 0,
  preferences: 0,
  penetrations: 0,
};

@UntilDestroy()
@Component({
  selector: 'app-brand-health-overview',
  templateUrl: './brand-health-overview.component.html',
  styleUrls: ['../bt.common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandHealthOverviewComponent
  extends BaseLocalFiltersComponent<BtHealthOverviewDataset>
  implements AfterViewInit, OnChanges, OnInit {
  @Input() public penetrationInMonthes: number;
  public penetrationTitle = penetrationTitle;

  public brandHealthOverview: { [key: string]: InlineStyleModel } = {
    content: {
      'max-width': '1035px',
      margin: 'auto',
      'justify-content': 'center',
      minHeight: '353px',
    },
    row: {
      display: 'grid',
      'grid-template-columns': 'repeat(2, 1fr)',
      gridGap: '32px 100px',
    },
    item: {
      // width: '33%',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      'align-items': 'center',
      'max-width': '345px',
      'max-height': '229px',
    },
    circle: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center',
      width: '50%',
      position: 'relative',
    },
    value: {
      position: 'absolute',
      'font-family': 'GT Walsheim Pro Medium',
      'line-height': '150%',
      'white-space': 'nowrap',
    },
    label: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'margin-top': '12px',
      'font-family': 'GT Walsheim Pro Medium',
      'line-height': '150%',
      'max-width': '200px',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      borderTop: '1px solid #E9E9E9',
      justifyContent: 'space-between',
    },
  };
  public currentDataSet$: Observable<BtHealthOverviewDataset>;
  public kpisList: KPITitle[] = [];
  public kpiTitle = [KPITitle.AidedAwareness, KPITitle.Consideration, KPITitle.Preference, KPITitle.Penetration];
  public toggleKpiTitle = [
    KPITitle.ToggleAidedAwareness,
    KPITitle.ToggleConsideration,
    KPITitle.TogglePreference,
    KPITitle.TogglePenetration];

  get calendarMode(): string {
    return this._globalFilterService.calendarMode;
  }

  constructor(
    public btStyle: BtStyleService,
    public ts: TranslateService,
    protected injector: Injector,
    private _globalFilterService: GlobalFilterService,
  ) {
    super(injector);
  }


  public ngOnInit(): void {
    this.initFilterModel(SCORE_CARD_LOCAL_FILTER);
    this.subscribeOnToggle();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const { clientWidth } = this.chartRef?.nativeElement;
      if (clientWidth < 450) {
        this.aspectRatio = 1.3;
      }
      super.ngAfterViewInit();
    }, 0);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet && this.filterForm) {
      this.applyFilters();
    }
  }

  public iconTypeByDifference(difference: KpiDifference): IconsType {
    return ARROWS[difference];
  }

  public kpiByTitle(title: KPITitle): string {
    return KPI_NAME[title];
  }

  public circleFill(title: KPITitle): string {
    return KPI_COLORS[title];
  }

  public getValue(title: KPITitle, currentDataSet: BtHealthOverviewDataset): number {
    return (
      (currentDataSet &&
        currentDataSet.currentIntervalBrandResultModels &&
        Math.round(currentDataSet.currentIntervalBrandResultModels[title])) ||
      0
    );
  }

  public getDifference(title: KPITitle, currentDataSet: BtHealthOverviewDataset): KpiDifference {
    const { currentIntervalBrandResultModels, previousIntervalBrandResultModels } = currentDataSet;
    if (!previousIntervalBrandResultModels) {
      return KpiDifference.Same;
    } else if (currentIntervalBrandResultModels[title] > previousIntervalBrandResultModels[title]) {
      return KpiDifference.Improved;
    } else if (currentIntervalBrandResultModels[title] < previousIntervalBrandResultModels[title]) {
      return KpiDifference.Lower;
    } else {
      return KpiDifference.Same;
    }
  }

  public applyFilters(): void {
    const { brands, segments } = this.filterForm.getRawValue();
    const data = cloneDeep(this.dataSet).find(({ brand }) => brand.id === brands);
    if (segments) {
      data.currentIntervalBrandResultModels = {
        ...data.currentIntervalBrandResultModels,
        ...(data.currentIntervalBrandResultModels?.segments.find(segment => segment.segmentId === segments) ?? NO_SEGMENT_DATA),
      };
      if (data.previousQuarterBrandResultModels) {
        data.previousQuarterBrandResultModels = {
          ...data.previousQuarterBrandResultModels,
          ...(data.previousQuarterBrandResultModels?.segments?.find(segment => segment.segmentId === segments) ?? NO_SEGMENT_DATA),
        };
      }
    }
    this.lowNumbers = this.service.getIntervalTotalsSegmentLow(segments);
    this.currentDataSet$ = of(data);
  }

  public getIntervals(): string {
    const { currentIntervalBrandResultModels } = this.dataSet[0];
    const calendarMode = NzCalendarModeMap.get(currentIntervalBrandResultModels.timeInternal);
    const firstDate = parseISO(calcFirstDateValue(this._globalFilterService.datesMap.get('startDate'), calendarMode));
    const lastDate = parseISO(calcLastDateValue(this._globalFilterService.datesMap.get('endDate'), calendarMode));
    return `${format(firstDate, 'yyyy-MM-dd')} - ${format(lastDate, 'yyyy-MM-dd')}`;
  }

  private subscribeOnToggle(): void {
    this._globalFilterService.movingAverage$
      .pipe(
        tap((res) => this.kpisList = res ? this.toggleKpiTitle : this.kpiTitle),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
