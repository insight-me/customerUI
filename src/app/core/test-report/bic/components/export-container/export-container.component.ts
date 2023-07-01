import { DOCUMENT, formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { sortBy } from 'lodash';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConceptReportTableDataType } from 'src/app/shared/enums/concept.report.table.data.type';
import { IconsType } from 'src/app/shared/enums/icons.type';
import { KPITitle, KPITooltips } from 'src/app/shared/models/bic.test.report/KPIModel';
import { COLORS_FOR_SCALE, OVERALL_SCORE_BUBBLE_CHART_COLORS, RELEVANCE_COLORS } from '../../../../../../assets/consts/consts';
import { AssociationsScoreDataModel } from '../../../../../shared/models/bic.test.report/association.score.data.model';
import { BarDataSetModel } from '../../../../../shared/models/bic.test.report/bar.data.set.model';
import { BubbleDataSetModel } from '../../../../../shared/models/bic.test.report/bubble.data.set.model';
import { ConceptBenefitsReasonsModel } from '../../../../../shared/models/bic.test.report/concept.benefits.reasons.model';
import { ConsumerInsightModel } from '../../../../../shared/models/bic.test.report/consumer.insight.model';
import { GroupedBarDataSet } from '../../../../../shared/models/bic.test.report/grouped.bar.data.set';
import {
  AccumulatedBenefits,
  AccumulatedLikes,
  AccumulatedReasons,
} from '../../../../../shared/models/bic.test.report/test.concept.result.model';
import { TotalRelevanceDataSetModel, TotalRelevanceModel } from '../../../../../shared/models/bic.test.report/total.relevance.model';
import { Company } from '../../../../../shared/models/company.model';
import { ListItem, MoodBoardItem, Test } from '../../../../../shared/models/test.model';
import { AppStateService } from '../../../../../shared/services/app-state/app-state.service';
import { TestReportUtils } from '../../../../../shared/utils/test.report.utils';
import { ReportCustomQuestionsService } from '../../../report.custom-questions.service';
import { BicReportStateService } from '../../bic.report.state.service';

const ITEMS_PER_PAGE = 3;
const PF_ITEMS_PER_PAGE = 2;
const LIKES_DISLIKES_PER_PAGE = 10;

const REPORT_STYLES = {
  backgroundPage: {
    margin: '60px 60px 20px 60px',
    width: '1629px',
    height: '1126px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderRadius: '8px',
  },
  backgroundPageContent: {
    margin: '93px 0 83px 0',
    display: 'grid',
    gridTemplateColumns: '787px 757px',
    gridGap: '80px',
    alignItems: 'center',
    textAlign: 'justify',
  },
  header: {
    height: '55px',
    marginTop: '20px',
    borderTop: '1px solid #E9E9E9',
    padding: '20px 0 7px 0',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#585858',
  },
  respondentOverview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: '60px',
    marginTop: '40px',
    fontFamily: 'GT Walsheim Pro Medium',
    fontStyle: 'bold',
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
  },
  respondentOverviewTable: {
    display: 'grid',
    gridTemplateColumns: '220px auto',
    gridGap: '40px',
    margin: '0 20px',
    fontFamily: 'GT Walsheim Pro Regular',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    borderBottom: '1px solid #b8b2ea33',
  },
  sectionCoverPage: {
    display: 'grid',
    gridTemplateColumns: '100px auto',
    gridGap: '100px',
    height: '1185px',
    margin: '20px',
  },
  sectionCoverText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '40px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#000000',
  },
  purchaseFrequencyGraph: {
    display: 'grid',
    gridGap: '60px',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '150%',
    color: '#8E8E93',
  },
  purchaseFrequencyGraphLegend: {
    position: 'absolute',
    bottom: '-100px',
    width: '84px',
    left: '-24px',
    height: '80px',
    textAlign: 'center',
    fontFamily: 'GT Walsheim Pro Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '150%',
    'word-break': 'break-word',
    color: '#8E8E93',
  },
  totalRelevanceLine: {
    borderBottom: '2px dashed #FF776F',
    position: 'absolute',
    'z-index': 1,
    width: '100%',
    'text-align': 'end',
    color: '#FF776F',
    height: '28px',
  },
  likesDislikesWord: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  moodboard: {
    display: 'flex',
    'flex-direction': 'row',
    'max-height': '815px',
  },
  moodboardLikePanel: {
    background: '#3C3768',
    position: 'absolute',
    padding: '8px 8px',
    left: 'calc(50% - 75px)',
    bottom: 0,
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
    'border-radius': '8px 8px 0 0',
    width: '150px',
  },
  moodboardLikePanelItem: {
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
    color: '#fff',
    'font-family': 'GT Walsheim Pro Regular',
    'font-size': '20px',
    'letter-spacing': '-0.13px',
    'line-height': '34px',
    'margin-right': '37px',
  },
  scaleQField: {
    display: 'grid',
    gridGap: '100px',
    width: '100%',
    marginTop: '40px',
  },
  scaleImage: {
    maxWidth: '560px',
    'max-height': '560px',
    'object-fit': 'contain',
  },
  singleGridGraph: {
    position: 'absolute',
    left: '0',
    width: '35px',
    bottom: '0',
    height: '100%',
    'background-color': '#fff',
  },
  logo: {
    color: 'rgb(0, 0, 0)',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '36px',
    'line-height': '38px',
    'z-index': 1,
    height: '100%',
    display: 'flex',
    'align-items': 'flex-end',
    'justify-content': 'center',
    padding: '40px',
  },
};

const REPORT_ELEMENTS_STYLES = {
  subtitle: {
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#585858',
  },
  title: {
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '32px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#000000',
    marginBottom: '12px',
  },
  text: {
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '24px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#000000',
  },
  contentOverviewTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '48px',
    marginBottom: '12px',
    background: '#E6E2F8',
    borderRadius: '5px',
    padding: '10px 20px 5px 20px',
    fontFamily: 'GT Walsheim Pro Medium',
    fontStyle: 'bold',
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#000000',
  },
  contentOverviewText: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '48px',
    marginBottom: '12px',
    background: '#fff',
    borderRadius: '5px',
    padding: '10px 20px 5px 70px',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '24px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
    color: '#000000',
  },
  textBold18: {
    fontFamily: 'GT Walsheim Pro Medium',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '150%',
    letterSpacing: '0.005em',
  },
  header3parts: {
    display: 'grid',
    gridTemplateColumns: '495px 805px 156px',
    gridGap: '85px',
    height: '55px',
    marginTop: '5px',
    padding: '13px 0 7px 0',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '140%',
    letterSpacing: '0.005em',
    color: '#585858',
  },
  header3partsLong: {
    display: 'grid',
    gridTemplateColumns: '495px 805px 156px',
    gridGap: '85px',
    height: '62px',
    marginTop: '20px',
    padding: '13px 0 7px 0',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '140%',
    letterSpacing: '0.005em',
    color: '#585858',
  },
  tableBody: {
    display: 'grid',
    gridGap: '0',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: '32px',
    letterSpacing: '0.005em',
    color: '#000',
  },
  tableHeader: {
    display: 'grid',
    gridGap: '24px',
    fontFamily: 'GT Walsheim Pro Regular',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '27px',
    letterSpacing: '0.005em',
    color: '#585858',
    minHeight: '27px',
    alignItems: 'end',
    marginBottom: '16px',
  },
  tableElem: {
    border: '1px solid #B8B2EA',
    padding: '12px',
  },
  titlePageDate: {
    fontFamily: 'GT Walsheim Pro Regular',
    fontSize: '20px',
    lineHeight: '30px',
    color: '#332F5B',
    paddingLeft: '84px',
    zIndex: '1',
  },
  titlePageReport: {
    fontFamily: 'GT Walsheim Pro Medium',
    fontSize: '68px',
    lineHeight: '102px',
    color: '#332F5B',
    paddingLeft: '84px',
    letterSpacing: '1.94286px',
    zIndex: '1',
  },
  titlePageType: {
    fontFamily: 'GT Walsheim Pro Medium',
    fontSize: '28px',
    lineHeight: '18px',
    color: '#FFFFFF',
    padding: '24px 0 12px 84px',
    zIndex: '1',
  },
  titlePageCompany: {
    fontFamily: 'GT Walsheim Pro Medium',
    fontSize: '28px',
    lineHeight: '68px',
    color: '#332F5B',
    paddingLeft: '84px',
    zIndex: '1',
  },
  testPreviewContainer: {
    marginTop: '40px',
    height: '930px',
  },
  testPreviewColumn: {
    display: 'flex',
    'flex-direction': 'column',
    maxWidth: '850px',
  },
  testPreviewConceptName: {
    fontFamily: 'GT Walsheim Pro Medium',
    textAlign: 'center',
    fontSize: '24px',
    padding: '32px 0',
  },
  testPreviewTexts: {
    fontFamily: 'GT Walsheim Pro Regular',
    textAlign: 'justify',
    fontSize: '18px',
    color: '#585858',
    'max-height': '381px',
    overflow: 'hidden',
  },
  overalScoreGraph: {
    position: 'relative',
    'border-left': '2px solid #D0D0D0',
    'border-bottom': '2px solid #D0D0D0',
    margin: '28px 45px 65px 60px',
    height: '570px',
  },
  overalScoreGraphImage: {
    position: 'relative',
    'border-left': '2px solid #D0D0D0',
    'border-bottom': '2px solid #D0D0D0',
    margin: '10px',
    height: '178px',
    width: '510px',
  },
  overalScoreGraphImageYellow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '240px',
    height: '74px',
    maxHeight: '74px',
    background: '#F9EF9A',
    borderRadius: '5px',
    margin: '10px',
  },
  overalScoreGraphImageViolet: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '240px',
    height: '74px',
    maxHeight: '74px',
    background: '#E6E2F8',
    borderRadius: '5px',
    margin: '10px',
  },
  overalScoreGraphImageBlue: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '240px',
    height: '74px',
    maxHeight: '74px',
    background: '#E3F2FD',
    borderRadius: '5px',
    margin: '10px',
  },
  overalScoreGraphImageGreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '240px',
    height: '74px',
    maxHeight: '74px',
    background: '#AFEBAB',
    borderRadius: '5px',
    margin: '10px',
  },
  overalScoreGraphImageText: {
    margin: '10px',
    fontFamily: 'GT Walsheim Pro Regular',
    fontWeight: 300,
    fontSize: '18px',
    textAlign: 'center',
    'line-height': '27px',
  },
  overalScoreLabel: {
    width: '200px',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'white-space': 'nowrap',
  },
  coverTitle: { fontSize: '68px', marginBottom: '20px' },
  coverPages: { fontSize: '20px', color: '#8E8E93' },
  graphPercent: {
    width: '100%',
    'text-align': 'center',
    position: 'absolute',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '16px',
    top: '-25px',
    'white-space': 'nowrap',
    color: '#000',
  },
  KPIGraphLabel: {
    position: 'absolute',
    bottom: '-100px',
    color: '#8E8E93',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '16px',
    'letter-spacing': '0.5px',
    'line-height': '24px',
    'word-break': 'normal',
    width: '200px',
    height: '81px',
    left: 'calc(50% - 100px)',
    textAlign: 'center',
  },
};

const CONTENT_OVERVIEW_ITEMS = {
  researchOverview: [
    {
      title: 'report.Research set-up',
      page: 4,
    },
    {
      title: 'report.Concept overview',
      page: 5,
    },
  ],
  results: [
    {
      title: 'report.Overall score',
      page: 'overal-score-cover',
    },
    {
      title: 'report.Brand & Business KPIs',
      page: 'kpi-cover',
    },
    {
      title: 'report.Associations',
      page: 'association-cover',
    },
    {
      title: 'report.Consumer insight, benefits, reasons to believe (RTB)',
      page: 'RTB-cover',
    },
    {
      title: 'report.Moodboard',
      page: 'moodboard-cover',
    },
    {
      title: 'report.Additional questions',
      page: 'aq-cover',
    },
    {
      title: 'report.Appendix',
      page: 'appendix-cover',
    },
  ],
};

const SECTIONS_COVER = {
  overalScore: {
    title: 'report.Overall score',
    pages: 'report.Pages',
    color: '#B8B2EA',
  },
  KPI: {
    title: 'report.Brand & Business KPIs',
    pages: 'report.Pages',
    color: '#F7C8D0',
  },
  associations: {
    title: 'report.Associations',
    pages: 'report.Pages',
    color: '#F9EF9A',
  },
  RTB: {
    title: 'report.Consumer insight, benefits and reasons to believe (RTB)',
    pages: 'report.Pages',
    color: '#AFEBAB',
  },
  moodboard: {
    title: 'report.Moodboard',
    pages: 'report.Pages',
    color: '#FFA56F',
  },
  additionalQuestions: {
    title: 'report.Additional questions',
    pages: 'report.Pages',
    color: '#ADD9F4',
  },
  appendix: {
    title: 'report.Appendix',
    pages: 'report.Pages',
    color: '#AFEBAB',
  },
};

@Component({
  selector: 'app-export-container',
  templateUrl: './export-container.component.html',
  styleUrls: ['./export-container.component.scss'],
})
export class ExportContainerComponent implements OnInit, AfterViewInit {
  public companyName$: Observable<string>;
  public date: string = formatDate(new Date(), 'y/MM/dd', 'en');
  public testPreview$: Observable<ConsumerInsightModel[][]>;
  public consumerInsight$: Observable<ConsumerInsightModel[]>;
  public purchaseFrequancy$: Observable<BarDataSetModel[][]>;
  public totalRelevanceData$: Observable<TotalRelevanceModel[]>;
  public benefits$: Observable<ConceptBenefitsReasonsModel[][]>;
  public reasonsToBelieve$: Observable<ConceptBenefitsReasonsModel[][]>;
  public consumerInsightRelevance$: Observable<ConceptBenefitsReasonsModel[][]>;
  public associationScorePercent$: Observable<AssociationsScoreDataModel>;
  public associationScoreIndex$: Observable<AssociationsScoreDataModel>;
  public whatDrives$: Observable<GroupedBarDataSet[][]>;
  public ConceptReportTableDataType = ConceptReportTableDataType;
  public IconsType = IconsType;
  public KPITitle = KPITitle;
  public tableRows: KPITitle[] = [
    KPITitle.Likeability,
    KPITitle.PurchaseIntent,
    KPITitle.PurchaseFrequency,
    KPITitle.CurrentBrandLikeability,
    KPITitle.Uniqueness,
    KPITitle.Relevance,
    KPITitle.Trustworthiness,
    KPITitle.Brandfit,
  ];
  public KPITooltips = KPITooltips;
  public Math = Math;

  @ViewChildren('pageRef') private pageRef: any;
  @Output() exportReady: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(
    private appStateService: AppStateService,
    public bicRSS: BicReportStateService,
    @Inject(DOCUMENT) private document: Document,
    public sanitizer: DomSanitizer,
    public rcqService: ReportCustomQuestionsService<Test>
  ) {}

  public ngOnInit(): void {
    this.companyName$ = this.appStateService.currentCompany.asObservable().pipe(
      filter(value => !!value),
      map(({ companyName }: Company) => companyName)
    );

    this.testPreview$ = this.bicRSS.consumerInsightDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((consumerInsight: ConsumerInsightModel[]) => TestReportUtils.splitArrayOnPages(consumerInsight, ITEMS_PER_PAGE))
    );

    this.purchaseFrequancy$ = this.bicRSS.purchaseFrequenciesDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((consumerInsight: BarDataSetModel[]) => TestReportUtils.splitArrayOnPages(consumerInsight, PF_ITEMS_PER_PAGE))
    );

    this.totalRelevanceData$ = this.bicRSS.totalRelevanceDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((relevanceData: TotalRelevanceModel[]) => {
        relevanceData.forEach(value => {
          value.pdfReport = TestReportUtils.splitArrayOnPages(value.dataSet, 13);
        });
        return relevanceData;
      })
    );

    this.consumerInsight$ = this.bicRSS.consumerInsightDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((consumerInsight: ConsumerInsightModel[]) => {
        const res: ConsumerInsightModel[] = [];
        consumerInsight.forEach((model: ConsumerInsightModel) => {
          const summaryDatasetModel = TestReportUtils.summaryDataSet(model.accumulatedLikes);
          const pages = Math.ceil(summaryDatasetModel.length / LIKES_DISLIKES_PER_PAGE);

          for (let i = 0; i < pages; i++) {
            const data = summaryDatasetModel.slice(LIKES_DISLIKES_PER_PAGE * i, LIKES_DISLIKES_PER_PAGE * (i + 1));
            const newModel = {
              ...model,
              summaryDatasetModel: data,
            };
            res.push(newModel);
          }
        });
        return res;
      })
    );

    this.benefits$ = this.mapConceptBenefitsReasons(this.bicRSS.benefitsDataSet$.asObservable());
    this.reasonsToBelieve$ = this.mapConceptBenefitsReasons(this.bicRSS.reasonsToBelieveDataSet$.asObservable());
    const consumerInsightRelevance: Observable<ConceptBenefitsReasonsModel[]> = this.bicRSS.consumerInsightRelevanceDataSet$
      .asObservable()
      .pipe(map(value => [value]));
    this.consumerInsightRelevance$ = this.mapConceptBenefitsReasons(consumerInsightRelevance);

    this.associationScorePercent$ = this.bicRSS.associationScorePrecentDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((associations: AssociationsScoreDataModel) => {
        associations.pdfData = TestReportUtils.splitArrayOnPages(associations.dataSource, 12);
        return associations;
      })
    );

    this.associationScoreIndex$ = this.bicRSS.associationScoreIndexDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((associations: AssociationsScoreDataModel) => {
        associations.pdfData = TestReportUtils.splitArrayOnPages(associations.dataSource, 10);
        return associations;
      })
    );

    this.whatDrives$ = this.bicRSS.whatDrivesDataSet$.asObservable().pipe(
      filter(value => !!value),
      map((dataSets: GroupedBarDataSet[]) => {
        const itemsPerPage = dataSets[0].values.length > 5 ? 4 : 6;
        return TestReportUtils.splitArrayOnPages(dataSets, itemsPerPage);
      })
    );

    this.tableRows = this.tableRows.filter(el => this.bicRSS.kpiMap.getValue().has(el));
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.exportReady.emit(this.html), 500);
  }

  public getContentOverviewItems(key: string): { title: string; page: number }[] {
    return CONTENT_OVERVIEW_ITEMS[key];
  }

  public get reportStyles(): {
    [key: string]: { [key: string]: string | number };
  } {
    return REPORT_STYLES;
  }

  public get reportElemStyles(): {
    [key: string]: { [key: string]: string | number };
  } {
    return REPORT_ELEMENTS_STYLES;
  }

  private mapConceptBenefitsReasons(observable: Observable<ConceptBenefitsReasonsModel[]>): Observable<ConceptBenefitsReasonsModel[][]> {
    return observable.pipe(
      filter(value => !!value),
      map((models: ConceptBenefitsReasonsModel[]) => models.filter(model => !!model?.accumulatedData.length)),
      map((models: ConceptBenefitsReasonsModel[]) => {
        const result = [];
        models.forEach((model: ConceptBenefitsReasonsModel) => {
          model.accumulatedData.sort((a, b) => b.originalPercent - a.originalPercent);
          const average = this.average(model);
          model.accumulatedData.forEach((item, index, items) => {
            if (item.originalPercent >= average && items[index + 1] && items[index + 1].originalPercent < average) {
              item.higherThenAverageEdge = true;
            }
            if (item.originalPercent < average && items[index - 1] && items[index - 1].originalPercent >= average) {
              item.lowerThenAverageEdge = true;
            }
            item.isHigher = item.originalPercent >= average;
          });
          const dataSets = TestReportUtils.splitArrayOnPages(model.accumulatedData, 10);
          dataSets.forEach(dataSet => {
            result.push({
              ...model,
              accumulatedData: dataSet,
            });
          });
        });
        return TestReportUtils.splitArrayOnPages(result, 2);
      })
    );
  }

  private get html(): string[] {
    return this.pageRef._results.map((element: ElementRef) => element.nativeElement.outerHTML);
  }

  public get allPages(): number {
    return this.pageRef?._results?.length;
  }

  public getPage(page: any): number {
    if (this.pageRef?._results.length) {
      return (
        Array.prototype.slice
          .call(this.pageRef?._results)
          .map(item => item.nativeElement)
          .findIndex(item => item.className?.includes(page)) + 1
      );
    }
  }

  public lastPage(page: string): number {
    if (this.pageRef?._results.length) {
      const pagesArr = Array.prototype.slice.call(this.pageRef?._results).map(item => item.nativeElement);
      const indexes = [];
      [...pagesArr].forEach((item, i) => {
        if (item.className?.includes(page)) {
          indexes.push(i);
        }
      });
      if (indexes.length) {
        return indexes[indexes.length - 1] + 1;
      }
    }
  }

  public get pageStyle(): { [key: string]: string } {
    return {
      width: '1754px',
      height: '1228px',
      border: '1px solid transparent',
      background: '#FFFFFF',
    };
  }

  public get pageContentStyle(): { [key: string]: string } {
    return {
      margin: '20px',
      width: '1710px',
      height: '1188px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      borderRadius: '8px',
    };
  }

  public get firstPageContentStyle(): { [key: string]: string } {
    return {
      ...this.pageContentStyle,
      background: '#B8B2EA',
    };
  }

  private get gradient(): { [key: string]: string } {
    return {
      position: 'absolute',
      width: '1184px',
      height: '1184px',
      background: 'radial-gradient(circle, #F7C8D0 0%, rgba(247,200,208,0) 70%)',
      'z-index': '0',
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

  public get pageContent(): { [key: string]: string } {
    return {
      flexGrow: '1',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      maxHeight: '950px',
    };
  }

  public get pageFooter(): { [key: string]: string } {
    return {
      fontFamily: 'GT Walsheim Pro Medium',
      fontSize: '18px',
      borderTop: '1px solid #E4E4E4',
      paddingTop: '17px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    };
  }

  public getBenefits(benefits: ListItem[]): string {
    return this.splitString(benefits.map(({ value }) => value).join('. '), 200);
  }

  public respondentOverviewGrid(items: number): { [key: string]: string } {
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + items + ', 1fr',
      gridGap: '60px',
      maxWidth: items > 1 ? '100%' : '850px',
      margin: '0 auto',
    };
  }

  public moodBoardData(data: ConsumerInsightModel): MoodBoardItem[][] {
    const { likedImages, dislikedImages }: AccumulatedLikes = data.accumulatedLikes;
    const dataSet: MoodBoardItem[][] = [];
    const items = [
      ...data.concept.moodboard.items.map((moodBoardItem: MoodBoardItem) => {
        moodBoardItem.likes = likedImages[moodBoardItem.id] || 0;
        moodBoardItem.dislikes = dislikedImages[moodBoardItem.id] || 0;
        return moodBoardItem;
      }),
    ];
    TestReportUtils.divideIntoColumnsPDF(items, dataSet);
    return dataSet;
  }

  public getHtml(model: ConsumerInsightModel, html: string = '', lengthNum: number): string {
    const needAddDots = html.length > lengthNum;
    if (needAddDots) {
      html = html.slice(0, lengthNum);
    }
    const { likedWords, dislikedWords } = model.accumulatedLikes;
    const colorForWord = word => {
      const likes: number = likedWords[word] || 0;
      const dislikes: number = dislikedWords[word] || 0;
      return likes && likes >= dislikes ? 'background:#DDF0DB;' : dislikes ? 'background:#FFD6D3;' : 'background:transparent';
    };
    const paragraphs: string[] = html.trim().split('\n');
    const commonStyle =
      'font-family: GT Walsheim Pro Regular; border-radius: 5px; display: inline-block; height: 24px; padding: 0 3px; margin: 0 2px;';
    html = paragraphs
      .map((paragraph, i) =>
        paragraph
          .split(' ')
          .map((word, index) => {
            if (i === paragraphs.length - 1 && needAddDots && index === paragraph.split(' ').length - 1) {
              return `<div style="${
                commonStyle + colorForWord(word.toLowerCase().trim())
              }"><span>${word}<span style="color: #8E8E93">(...)</span></span></div>`;
            } else {
              return `<div style="${commonStyle + colorForWord(word.toLowerCase().trim())}"><span>${word}</span></div>`;
            }
          })
          .join(' ')
      )
      .join('</br>');
    return html;
  }

  public benefits(benefits: ListItem[]): string {
    return benefits.map(({ value }) => value).join('. ');
  }

  public reasons(reasons: ListItem[]): string {
    return reasons.map(({ value }) => this.splitString(value, 80)).join('\n');
  }

  public get iconStyle(): { [key: string]: string } {
    return {
      'font-size': '18px',
      'letter-spacing': '0',
      'line-height': '18px',
      margin: '0 30px 10px 0',
      display: 'flex',
      'align-items': 'center',
    };
  }

  private get icon(): { [key: string]: string } {
    return {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      marginRight: '11px',
    };
  }

  public get likesIcon(): { [key: string]: string } {
    return {
      ...this.icon,
      background: '#AFEBAB',
    };
  }

  public getMaxImageHeight(imagesLength: number): string {
    return (844 / imagesLength > 400 ? 400 : 844 / imagesLength).toString();
  }

  public get dislikesIcon(): { [key: string]: string } {
    return {
      ...this.icon,
      background: '#FF776F',
    };
  }

  public getBackground(index: number, secondColorsSet: boolean): string {
    return TestReportUtils.getColor(index, secondColorsSet);
  }

  public getGridBackground(index: number): string {
    return OVERALL_SCORE_BUBBLE_CHART_COLORS[index];
  }

  public getStyle(
    dataSet: ConceptBenefitsReasonsModel,
    item: AccumulatedBenefits | AccumulatedReasons,
    isNameColumn: boolean,
    type: ConceptReportTableDataType
  ): { [key: string]: string } {
    return {
      background: this.background(item.isHigher, isNameColumn, type),
      color: '#000',
    };
  }

  private background(isHigher: boolean, isNameColumn: boolean, type: ConceptReportTableDataType): string {
    switch (type) {
      case ConceptReportTableDataType.Benefits:
        return isNameColumn ? '#F6F5FC' : isHigher ? '#B8B2EA' : '#E6E2F8';
      case ConceptReportTableDataType.Reasons:
        return isNameColumn ? '#fff6f0' : isHigher ? '#ffa56f' : '#FFCBAD';
    }
  }

  public average(dataSet: ConceptBenefitsReasonsModel): number {
    if (!dataSet.accumulatedData.length) {
      return null;
    }
    const elements = dataSet.accumulatedData.map(({ originalPercent }) => originalPercent);
    const min = Math.min(...elements);
    const max = Math.max(...elements);
    return Math.round((min + max) / 2);
  }

  public getSorted(data) {
    return sortBy(data, 'label', 'asc');
  }

  public getItemStyle(item: BubbleDataSetModel): { [key: string]: string } {
    const itemStyle = {
      left: `${item.x}%`,
      bottom: `${item.y}%`,
      background: TestReportUtils.getColor(item.index),
      'box-sizing': 'border-box',
      position: 'absolute',
      width: '60px',
      height: '60px',
      'border-radius': '50%',
      margin: '0 0 -30px -30px',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center',
      color: '#fff',
      'font-family': 'GT Walsheim Pro Regular',
      'font-size': '20px',
      'letter-spacing': '0',
      'line-height': '23px',
    };
    if (item.isCluster) {
      itemStyle.width = '73px';
      itemStyle.height = '73px';
      itemStyle.margin = '0 0 -38px -38px';
      itemStyle.background = `conic-gradient(${this._compositionConicGradientBG(item)})`;
    }
    return itemStyle;
  }

  public horizontalAxis(benchmark: number): number[] {
    const horizontalAxis = [];
    for (let i = 0; i <= 10; i++) {
      if (+benchmark === i * 10) {
        continue;
      }
      horizontalAxis.push(i);
    }
    return horizontalAxis;
  }

  public showSubAxisLabel(axis: number, benchmark: number): boolean {
    return Math.floor(benchmark / 10) !== axis;
  }

  public graphStyle(conceptTotal: BarDataSetModel, index: number): { [key: string]: string } {
    const color =
      index === -1
        ? OVERALL_SCORE_BUBBLE_CHART_COLORS[OVERALL_SCORE_BUBBLE_CHART_COLORS.length - 1]
        : OVERALL_SCORE_BUBBLE_CHART_COLORS[index];
    const background = `linear-gradient(180deg, ${color} 0%, ${color}4d 100%)`;
    return {
      height: (conceptTotal.value || 1) + '%',
      background,
    };
  }

  public singleStyle(value: number, index: number): { [key: string]: string } {
    const color = OVERALL_SCORE_BUBBLE_CHART_COLORS[index];
    const background = `linear-gradient(180deg, ${color} 0%, ${color}4d 100%)`;
    return {
      height: (value || 1) + '%',
      background,
    };
  }

  public singleGridStyle(value: number, index: number): { [key: string]: string } {
    return {
      height: (value || 1) + '%',
      background: this.getBackground(index, false),
    };
  }

  public scaleGraphStyle(value: number, index: number): { [key: string]: string } {
    const background = index === 0 ? '#E9ECEF' : COLORS_FOR_SCALE[index - 1];
    return {
      height: (value || 1) + '%',
      background,
    };
  }

  public groupStyle(concept: BarDataSetModel, index: number): { [key: string]: string } {
    const color = TestReportUtils.getColor(index);
    const background = `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`;
    return {
      height: (concept.value || 1) + '%',
      background,
    };
  }

  public relevanceStyle(bar: TotalRelevanceDataSetModel): {
    [key: string]: string;
  } {
    const background = RELEVANCE_COLORS[bar.type];
    return {
      background,
      height: (bar.value || 1) + '%',
      'border-radius': '14px',
      'margin-bottom': '3px',
      'min-width': '40px',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'flex-end',
    };
  }

  public barStyle(bar: BarDataSetModel, index: number): { [key: string]: string } {
    const color = TestReportUtils.getColor(index, true);
    const background = `linear-gradient(270deg, ${color} 0%, ${color}80 100%)`;
    const width = `${bar.value}%`;
    return {
      width,
      background,
      height: '27px',
      'border-radius': '14px',
      'margin-bottom': '3px',
      'min-width': '50px',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'flex-end',
    };
  }

  public splitString(str: string, length: number): string {
    if (str.length > length) {
      return str.slice(0, length) + '...';
    } else {
      return str;
    }
  }

  public splitStringWithBraces(str: string, length: number): string {
    if (str.length > length) {
      return str.slice(0, length).trim() + `<span style="color: #8E8E93">(...)</span>`;
    } else {
      return str;
    }
  }

  public splitArray(arr: any[], length: number): any[] {
    return arr.slice(0, length);
  }

  public hasSameValue(dataSet: BubbleDataSetModel[], index: number, field: string): boolean {
    let hasSameValue = false;
    for (let i = 0; i < index; i++) {
      if (dataSet[i][field] === dataSet[index][field]) {
        hasSameValue = true;
      }
    }
    return !hasSameValue;
  }

  public getSectionCover(section: string): { [key: string]: string | number } {
    return SECTIONS_COVER[section];
  }

  public getArrow(isHoriszontal: boolean): { [key: string]: string | number } {
    return isHoriszontal
      ? {
          border: 'solid #D0D0D0',
          'border-width': '0 2px 2px 0',
          display: 'inline-block',
          padding: '7px',
          position: 'absolute',
          transform: 'rotate(-135deg)',
          top: 0,
          left: '-9px',
        }
      : {
          border: 'solid #D0D0D0',
          'border-width': '0 2px 2px 0',
          display: 'inline-block',
          padding: '7px',
          position: 'absolute',
          transform: 'rotate(-45deg)',
          bottom: '-9px',
          right: 0,
        };
  }

  public getPI(): { [key: string]: string | number } {
    return {
      color: '#8E8E93',
      'font-family': 'GT Walsheim Pro Medium',
      'font-size': '16px',
      'letter-spacing': '0.5px',
      'line-height': '150%',
      position: 'absolute',
      'z-index': 1,
      width: '300px',
      textAlign: 'end',
      top: '325px',
      left: '-60px',
      transform: 'rotate(-90deg)',
      transformOrigin: 'top left',
    };
  }

  public getUniqueness(): { [key: string]: string | number } {
    return {
      color: '#8E8E93',
      'font-family': 'GT Walsheim Pro Medium',
      'font-size': '16px',
      'letter-spacing': '0.5px',
      'line-height': '150%',
      position: 'absolute',
      'z-index': 1,
      bottom: '-70px',
      right: 0,
    };
  }

  public getBenchmark(): { [key: string]: string | number } {
    return {
      position: 'absolute',
      color: '#8e8e93',
      'font-family': 'GT Walsheim Pro Regular',
      'font-size': '16px',
      'letter-spacing': '0.5px',
      'line-height': '150%',
      'border-left': '1px dashed #E0E0E0',
      height: '100%',
    };
  }

  public getBenchmarkHorizontal(): { [key: string]: string | number } {
    return {
      position: 'absolute',
      color: '#8e8e93',
      'font-family': 'GT Walsheim Pro Regular',
      'font-size': '16px',
      'letter-spacing': '0.5px',
      'line-height': '150%',
      'border-top': '1px dashed #E0E0E0',
      width: '100%',
    };
  }

  public checkConceptInSamePosition(dataSet: BubbleDataSetModel[]): BubbleDataSetModel[] {
    const uniqBubbles: BubbleDataSetModel[] = [];
    dataSet?.forEach((data, index) => {
      data.index = index;
      if (!uniqBubbles.length) {
        uniqBubbles.push({ ...data });
        return;
      }
      const samePositionBubble = uniqBubbles.find(uniqBubble => uniqBubble.x === data.x && uniqBubble.y === data.y);
      if (samePositionBubble) {
        samePositionBubble.isCluster = true;
        samePositionBubble.clusterLabels = [...(samePositionBubble.clusterLabels || [samePositionBubble.label])];
        samePositionBubble.clusterLabels.push(data.label);
        samePositionBubble.clusterIndxs = [...(samePositionBubble.clusterIndxs || [samePositionBubble.index])];
        samePositionBubble.clusterIndxs.push(index);
      } else {
        uniqBubbles.push({ ...data });
      }
    });
    return uniqBubbles;
  }

  public getSeparatorStyle(item: BubbleDataSetModel, index: number): { [key: string]: string } {
    const rotate = Math.round(360 / item.clusterIndxs.length) * index;
    return {
      position: `absolute`,
      width: `2px`,
      height: `57%`,
      background: `#ffffff`,
      transform: `rotate(${rotate}deg) translate(0px, -15px)`,
    };
  }

  public getClusterTitleStyle(): { [key: string]: string } {
    return {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60%',
      width: '60%',
      borderRadius: '50%',
      background: '#fff',
    };
  }

  public getAssocIndexColor(num: number): string {
    return num < 93 ? '#FF776F' : num > 107 ? '#4DAC48' : '#000';
  }

  private _compositionConicGradientBG(bubble: BubbleDataSetModel): string {
    let result = '';
    const calculatedPrecent = 100 / bubble.clusterIndxs.length;
    bubble.clusterIndxs.forEach((clusterIndx, index) => {
      result += `${TestReportUtils.getColor(clusterIndx)} ${calculatedPrecent * index}% ${calculatedPrecent * (index + 1)}%,`;
    });
    result = result.slice(0, -1);
    return result;
  }
}
