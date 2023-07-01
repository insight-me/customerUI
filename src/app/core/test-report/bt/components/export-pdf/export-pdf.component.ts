import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChildren
} from '@angular/core';
import { InlineStyleModel } from '../../../../../shared/models/inline.style.model';
import { formatDate } from '@angular/common';
import {BehaviorSubject, Observable, of, zip} from 'rxjs';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import {filter, map, retry} from 'rxjs/operators';
import { Company } from '../../../../../shared/models/company.model';
import { BtReportStateService } from '../../bt.report.state.service';
import { BrandFunnelDatasetModel } from '../../../../../shared/models/bt.test.report/brand.funnel.dataset.model';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { BtStyleService } from '../../bt.style.service';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import {
  BtAssociationsComparedToCompetitorsDataset
} from "../../../../../shared/models/bt.test.report/bt.associations.compared.to.competitors.dataset";
import {ListItem} from "../../../../../shared/models/test.model";
import {
  BrandAssociationOverTimeFilterModel
} from "../../../../../shared/models/bt.test.report/brand.association.over.time.filter.model";
import {TranslateService} from "@ngx-translate/core";
import {GroupedBarDataSet} from "../../../../../shared/models/bic.test.report/grouped.bar.data.set";
import {
  BtCommercialRecognitionDataset
} from "../../../../../shared/models/bt.test.report/bt.commercial.recognition.dataset";
const ngx_style = '<style>.ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:none}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:none}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{opacity:.2;transition:opacity .1s ease-in-out}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{fill:none;stroke:#ddd;stroke-width:1}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-dasharray:5;stroke-dashoffset:5;stroke-width:1}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill:#000;fill-opacity:.05}.ngx-charts .gridline-path-dotted{fill:none;stroke:#ddd;stroke-dasharray:1,20;stroke-dashoffset:3;stroke-width:1}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}</style>'
const SVG_STYLE = `<style type="text/css">
  svg g .tick text {
      fill: #8e8e93;
      font-family: "GT Walsheim Pro Regular";
      font-size: 14px !important;
  }
  .gridline-path{fill:none;stroke:#ddd;stroke-width:1}
  .gridline-path-vertical {
    stroke-dasharray: 5,5;
  }

  g.line-chart > g:last-of-type > g:nth-child(n) g.line-series > path {
    stroke-width: 4;
    stroke-linecap: round;
  }
</style>`;
const BRAND_FUNNEL_ITEMS_PER_PAGE = 8;
const labels = [
  'Spontaneous awareness', 'Top of mind spontaneous awareness', 'Aided awareness', 'Consideration', 'Preference', 'Penetration'
];
const transform_style = `<style>
  .transform-class {
  -webkit-transform: rotate(270deg);
}
</style>`;
const HORIZONTAL_BARS_PER_PAGE = 20;

@Component({
  selector: 'app-export-pdf',
  templateUrl: './export-pdf.component.html',
  styleUrls: ['./export-pdf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportPdfComponent implements OnInit, AfterViewInit {

  public style: {[key: string]: InlineStyleModel} = {
    page: {
      width: '1754px',
      height: '1228px',
      border: '1px solid #fff',
    },
    pageContent: {
      margin: '13px 21px 21px 13px',
      width: '1720px',
      height: '1194px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center'
    },
    header: {
      fontFamily: 'GT Walsheim Pro Medium',
      fontSize: '32px',
      lineHeight: '32px',
      padding: '20px'
    },
    subHeader: {
      fontFamily: 'GT Walsheim Pro Medium',
      fontSize: '20px',
      lineHeight: '150%',
      padding: '0 20px'
    },
    content: {
      flexGrow: '1',
     //padding: '20px 25px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    watermark: {
      fontFamily: 'GT Walsheim Pro Regular',
      'font-size': '14px',
      'line-height': '150%',
      color: '#8E8E93'
    },
    text: {
      fontFamily: 'GT Walsheim Pro Regular',
      'font-size': '18px',
      'line-height': '150%',
    }
  }

  public date: string = formatDate(new Date(), 'y/MM/dd', 'en');
  public watermarkDate: string = formatDate(new Date(), 'y-MM-dd', 'en');
  public companyName$: Observable<string>;
  public brandFunnelPages$: Observable<BrandFunnelDatasetModel[][]>;
  public brandFunnelAverage$: Observable<{[key: string]: number}>;
  public brandHealthComparedToCompetitorsPages$: Observable<BarDataSetModel[][][]>;
  public brandHealthComparedToCompetitorsWidth: string = '45%';
  public brandHealthComparedToCompetitorsLabels: string[][];
  public associationsComparedToCompetitorsPages$: Observable<BtAssociationsComparedToCompetitorsDataset[][]>;
  public healthInTargetGroupsPages$: Observable<GroupedBarDataSet[][]>;
  public associationsInTargetGroupsPages$: Observable<GroupedBarDataSet[][]>;
  public commercialRecognitionDataSetPages$: Observable<BtCommercialRecognitionDataset[][]>;

  @ViewChildren('pageRef') private pageRef: any;
  @Output() public exportReady: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(
    private appStateService: AppStateService,
    public btRSS: BtReportStateService,
    public btStyle: BtStyleService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.companyName$ = this.appStateService.currentCompany.asObservable()
      .pipe(
        filter(value => !!value),
        map(({companyName}: Company) => companyName)
      );

    this.brandFunnelPages$ = this.btRSS.brandFunnelDataSet$.asObservable()
      .pipe(
        filter(value => !!value),
        map((dataSet: BrandFunnelDatasetModel[]) => {
          const currentSelection = this.btRSS.brandFunnelFilter.value;
          const currentDataSet = dataSet.filter(item => currentSelection.includes(item.brand.id));

          this.brandFunnelAverage$ = of({
            aidedAwarenessToConsideration: TestReportUtils.getAverage('aidedAwarenessToConsideration', currentDataSet),
            considerationToPreference: TestReportUtils.getAverage('considerationToPreference', currentDataSet),
            aidedAwarenessToPenetration: TestReportUtils.getAverage('aidedAwarenessToPenetration', currentDataSet),
          })

          return TestReportUtils.splitArrayOnPages(currentDataSet, BRAND_FUNNEL_ITEMS_PER_PAGE);
        })
      );

    this.healthInTargetGroupsPages$ = this.btRSS.healthInTargetGroups$.asObservable()
      .pipe(
        filter(value => !!value),
        map((dataSet: GroupedBarDataSet[]) => {
          if (dataSet[0].values.length < 4) {
            return [dataSet];
          } else {
            return TestReportUtils.splitArrayOnPages(dataSet, 4);
          }
        })
      );

    this.brandHealthComparedToCompetitorsPages$ = zip(
      this.btRSS.spontaneousAwareness$,
      this.btRSS.topOfMindSpontaneousAwareness$,
      this.btRSS.aidedAwareness$,
      this.btRSS.consideration$,
      this.btRSS.preference$,
      this.btRSS.penetration$
    )
      .pipe(
        map((data: BarDataSetModel[][]) => {
          const selected = this.btRSS.brandHealthComparedToCompetitorsFilter.value.length;
          let itemsPerPage = 4;
          if (selected >= 10) {
            itemsPerPage = 2;
            this.brandHealthComparedToCompetitorsWidth = '90%';
          } else if (selected <= 5) {
            itemsPerPage = 6;
            this.brandHealthComparedToCompetitorsWidth = '28%';
          }
          this.brandHealthComparedToCompetitorsLabels = TestReportUtils.splitArrayOnPages(labels, itemsPerPage)
          return TestReportUtils.splitArrayOnPages(data, itemsPerPage);
        })
      );

    this.associationsComparedToCompetitorsPages$ = this.btRSS.associationsComparedToCompetitorsDataSet$
      .pipe(
        filter(value => !!value),
        map(dataset => TestReportUtils.splitArrayOnPages(dataset, 4))
      );

    this.associationsInTargetGroupsPages$ = this.btRSS.associationsInTargetGroups$.asObservable()
      .pipe(
        filter(value => !!value),
        map((dataSets: GroupedBarDataSet[]) => {
          const itemsPerPage = Math.floor(HORIZONTAL_BARS_PER_PAGE / dataSets[0].values.length) || 1;
          return TestReportUtils.splitArrayOnPages(dataSets, itemsPerPage);
        })
      );

    this.commercialRecognitionDataSetPages$ = this.btRSS.commercialRecognitionDataSet$.asObservable()
      .pipe(
        filter(value => !!value),
        map((dataSets: BtCommercialRecognitionDataset[]) => {
          let itemsPerPage = dataSets.length || 1;
          if (dataSets.length > 10) {
            itemsPerPage = Math.ceil(dataSets.length / 2);
          }
          return TestReportUtils.splitArrayOnPages(dataSets, itemsPerPage);
        })
      )
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.exportReady.emit(this.html);
    }, 1000);
  }

  private get html(): string[] {
    return this.pageRef._results.map((element: ElementRef) => {
      if (element.nativeElement.attributes['data-attr']) {
        return ngx_style + SVG_STYLE + element.nativeElement.outerHTML;
      } else {
        return element.nativeElement.outerHTML;
      }
    });
  }

  public get firstPageContentStyle(): { [key: string]: string } {
    return {
      ...this.style.pageContent,
      background: '#B8B2EA',
    };
  }

  private get gradient(): { [key: string]: string } {
    return {
      position: 'absolute',
      width: '1184px',
      height: '1184px',
      background: 'radial-gradient(circle, #F7C8D0 0%, rgba(247,200,208,0) 70%)',
      'z-index': '0'
    };
  }

  public get firstGradient(): { [key: string]: string } {
    return {
      ...this.gradient,
      top: '94px',
      left: '-25px',
    };
  }

  public get secondGradient(): { [key: string]: string } {
    return {
      ...this.gradient,
      top: '-155px',
      left: '637px',
    };
  }

  public get thirdGradient(): { [key: string]: string } {
    return {
      ...this.gradient,
      top: '-195px',
      left: '480px',
      width: '1956px',
      height: '1956px',
    };
  }

  public getBrandSelection(selection: string[]): string {
    return selection
      .map(brandId => this.btRSS.brands$.getValue().find(({id}: ListItem) => id === brandId).value)
      .join(', ');
  }

  public get associationGraphOption(): string {
    return this.btRSS.associationsOverTimeFilter.value
      .map(associationId => this.btRSS.associations$.getValue().find(({id}: ListItem) => id === associationId).value)
      .join(', ');
  }

  public get brandAndAssociationGraphOption(): string {
    const {brands, association}: BrandAssociationOverTimeFilterModel = this.btRSS.brandAndAssociationsOverTimeFilter.value;
    const associationLabel = this.btRSS.associations$.getValue().find(({id}: ListItem) => id === association).value;
    const brandsLabel = this.getBrandSelection(brands);
    return this.translate.instant('report.Association: {{association}}. Brand(s): {{brands}}', {
      association: associationLabel,
      brands: brandsLabel
    })
  }

  public getBackground(index: number): string {
    return TestReportUtils.getLineChartColor(index);
  }

}
