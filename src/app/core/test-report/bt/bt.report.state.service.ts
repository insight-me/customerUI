import { DOCUMENT, formatDate } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, forIn, omit, sortBy } from 'lodash';
import { BehaviorSubject, forkJoin, merge, Observable, Subject } from 'rxjs';
import { debounceTime, delay, filter, first, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { GlobalFilterService } from 'src/app/core/test-report/bt/components/global-filter.service';
import { BarDataSetModel } from 'src/app/shared/models/bic.test.report/bar.data.set.model';
import { GroupedBarDataSet } from 'src/app/shared/models/bic.test.report/grouped.bar.data.set';
import { KPIModel, KPITitle } from 'src/app/shared/models/bic.test.report/KPIModel';
import { RespondentOverviewModel } from 'src/app/shared/models/bic.test.report/respondent.overview.model';
import { TestResultFilterModel } from 'src/app/shared/models/bic.test.report/test.result.filter.model';
import { BTBrand, BtCustomAssociation, BTTest, BtTestAssociation } from 'src/app/shared/models/bt-test.model';
import { IBrandFunnelDataset, INewBrandFunnelDatasetItem } from 'src/app/shared/models/bt.test.report/brand.funnel.dataset.model';
import { BtAssociationsComparedToCompetitorsDataset } from 'src/app/shared/models/bt.test.report/bt.associations.compared.to.competitors.dataset';
import { BtBrandAssociationOverTime } from 'src/app/shared/models/bt.test.report/bt.brand.association.over.time';
import { BtBrandsKpiLineChartDataset } from 'src/app/shared/models/bt.test.report/bt.brands.kpi.line.chart.dataset.model';
import { BtCompetitorsPerformanceOverTimeDataset } from 'src/app/shared/models/bt.test.report/bt.competitors.performance.over.time.dataset';
import { BtHealthOverviewDataset } from 'src/app/shared/models/bt.test.report/bt.health.overview.dataset.model';
import { BtTestResultModel, IntervalTotalItem, IntervalTotals } from 'src/app/shared/models/bt.test.report/bt.test.result.model';
import { BtBrandsLineChartDataSet } from 'src/app/shared/models/bt.test.report/btBrandsLineChartDataSet';
import { LineChartDataSet } from 'src/app/shared/models/bt.test.report/line.chart.dataset';
import { RespondentOptions } from 'src/app/shared/models/test-creation.model';
import { Association, Country, ListItem, RespondentRequirements } from 'src/app/shared/models/test.model';
import { TreeMultiselectOptionsModel } from 'src/app/shared/models/tree.multiselect.options.model';
import { AppStateService } from 'src/app/shared/services/app-state/app-state.service';
import { BtTestService } from 'src/app/shared/services/bt-test/bt-test.service';
import { TestReportUtils } from 'src/app/shared/utils/test.report.utils';
import { AGE_GROUPS_FOR_REPORT, KPI_NAME, NO_ORDER_ID } from 'src/assets/consts/consts';
import { LOW_NUMBER_OF_RESPONDENTS } from 'src/assets/consts/report.const';
import { TestStateService } from '../test.state.service';

const test_kpi: KPIModel[] = [
  // {
  //   id: 'SpontaneousAwareness',
  //   title: KPITitle.SpontaneousAwareness,
  // },
  // {
  //   id: 'TopOfMindSpontaneousAwareness',
  //   title: KPITitle.TopOfMindSpontaneousAwareness,
  // },
  {
    id: 'AidedAwareness',
    title: KPITitle.AidedAwareness,
  },
  {
    id: 'Consideration',
    title: KPITitle.Consideration,
  },
  {
    id: 'Preference',
    title: KPITitle.Preference,
  },
  {
    id: 'Penetration',
    title: KPITitle.Penetration,
  },
];

@Injectable()
export class BtReportStateService extends TestStateService<BTTest> {
  public form: FormGroup = this.formBuilder.group({
    brand: [null, [Validators.required]],
    brandHealthComparedToCompetitorsFilter: [[], [Validators.required]],
    brandHealthDemography: this.demographyFormGroup,
    commercialRecognitionDemography: this.demographyFormGroup,
  });
  public movingAverageHash = new Map<KPITitle, KPIModel>([]);
  public hashMap = new Map<KPITitle, KPIModel>();
  /*Filter Sources*/
  public healthInTargetGroupsFilterSource: Subject<void> = new Subject<void>();
  public purchaseFrequencyCategoryId: string;

  public currentBrand: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public targetGroupPerformanceOverTimeLabel$: Observable<string>;
  public competitorsPerformanceOverTimeLabel$: Observable<string>;
  public brandPerformanceOverTimeLabel$: Observable<string>;

  /*Form options*/
  public ownBrands: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  public competitorsBrands: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  public brands$: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  public associations$: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);

  /*Dashboard*/
  public brandHealthOverviewDataSet$: BehaviorSubject<BtHealthOverviewDataset[]> = new BehaviorSubject<BtHealthOverviewDataset[]>(null);
  public brandPerformanceOverTime$: BehaviorSubject<BtBrandsLineChartDataSet[]> = new BehaviorSubject<BtBrandsLineChartDataSet[]>(null);
  public targetGroupPerformanceOverTime$: BehaviorSubject<BtBrandsKpiLineChartDataset[]> = new BehaviorSubject<
    BtBrandsKpiLineChartDataset[]
  >(null);
  public competitorsPerformanceOverTime$: BehaviorSubject<BtCompetitorsPerformanceOverTimeDataset[]> = new BehaviorSubject<
    BtCompetitorsPerformanceOverTimeDataset[]
  >(null);
  /*Brand funnel*/
  public brandFunnelDataSet$: BehaviorSubject<IBrandFunnelDataset[]> = new BehaviorSubject<IBrandFunnelDataset[]>(null);

  /*Brand health breakdown*/
  public healthInTargetGroups$: BehaviorSubject<GroupedBarDataSet[]> = new BehaviorSubject<GroupedBarDataSet[]>(null);
  public spontaneousAwareness$: Observable<BarDataSetModel[]>;
  public topOfMindSpontaneousAwareness$: Observable<BarDataSetModel[]>;
  public aidedAwareness$: Observable<BarDataSetModel[]>;
  public consideration$: Observable<BarDataSetModel[]>;
  public preference$: Observable<BarDataSetModel[]>;
  public penetration$: Observable<BarDataSetModel[]>;
  public itemWidth$: Observable<string>;

  /*Associations*/
  public associationsOverTimeDataSet$: BehaviorSubject<BtBrandsLineChartDataSet[]> = new BehaviorSubject<BtBrandsLineChartDataSet[]>(null);
  public brandAndAssociationsOverTimeDataSet$: BehaviorSubject<BtBrandAssociationOverTime[]> = new BehaviorSubject<
    BtBrandAssociationOverTime[]
  >(null);
  public associationsExpandedCharts: Set<number> = new Set<number>();
  public associationsComparedToCompetitorsDataSet$: BehaviorSubject<BtAssociationsComparedToCompetitorsDataset[]> = new BehaviorSubject<
    BtAssociationsComparedToCompetitorsDataset[]
  >([]);
  public associationsInTargetGroups$: BehaviorSubject<GroupedBarDataSet[]> = new BehaviorSubject<GroupedBarDataSet[]>(null);

  public adAwarenessMainDataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>([]);
  public awarenessPerformanceOverTime$: BehaviorSubject<BtBrandsLineChartDataSet[]> = new BehaviorSubject<BtBrandsLineChartDataSet[]>(null);
  public netPromoterScoreMainDataSet$: BehaviorSubject<LineChartDataSet[]> = new BehaviorSubject<LineChartDataSet[]>(null);
  public netPromoterScoreOverTime$: BehaviorSubject<BtBrandsLineChartDataSet[]> = new BehaviorSubject<BtBrandsLineChartDataSet[]>(null);

  public intervalTotals$: BehaviorSubject<IntervalTotals> = new BehaviorSubject<IntervalTotals>(null);

  /*PDF Respondent Overview*/
  public definedRespondentOverview: BehaviorSubject<RespondentOverviewModel> = new BehaviorSubject<RespondentOverviewModel>(null);

  public switcher$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public brandFunnelFooterTableAverage$: BehaviorSubject<{ [key: string]: number }> = new BehaviorSubject(null);

  constructor(
    public btTestService: BtTestService,
    private appStateService: AppStateService,
    protected injector: Injector,
    private globalFilterService: GlobalFilterService,
    @Inject(DOCUMENT) public document: Document
  ) {
    super(injector);
    this.appStateService.getCountries();
  }

  public getTestById(id: string): Observable<BTTest> {
    return this.btTestService.getTestById(id).pipe(
      filter(value => !!value),
      tap(test => {
        this.reportCustomQuestionsService.resetCustomQuestionsData();
        this.reportCustomQuestionsService.setTest(test);
      }),
      map((test: BTTest) => {
        test.testKPIs = test_kpi;
        TestReportUtils.addOtherSegment(test.respondentRequirements);
        test.respondentRequirements.segments = test.respondentRequirements.segments.filter(segment => !segment.isDefault);
        return test;
      }),
      switchMap(test =>
        forkJoin([this.testService.getRespondentOptions(test.sv), this.btTestService.getAssociations()]).pipe(
          tap(([respondentOptions, associations]) => this.buildFilterForms(test, respondentOptions, associations)),
          map(() => test)
        )
      )
    );
  }

  public getReportData(filters?: Record<string, any>): Observable<BtTestResultModel> {
    return this.testResultService.getBTTestResultByFilter(filters, this.test.id).pipe(tap(this.getDataSets.bind(this)));
  }

  private getDataSets(data: BtTestResultModel): void {
    this.kpiMap.next(!this.globalFilterService.movingAverage$.getValue() ? this.hashMap : this.movingAverageHash);

    this.kpiMap
      .asObservable()
      .pipe(
        first(),
        tap((kpi: Map<KPITitle, KPIModel>) => {
          /*initial values*/
          const [previousInterval, currentInterval] = TestReportUtils.getIntervals(data.brandResultModels);
          const brandHealthOverviewDataSet: BtHealthOverviewDataset[] = [];
          const brandPerformanceOverTime: BtBrandsLineChartDataSet[] = [];
          const awarenessPerformanceOverTime: BtBrandsLineChartDataSet[] = [];
          const targetGroupPerformanceOverTime: BtBrandsKpiLineChartDataset[] = [];
          const competitorsPerformanceOverTime: BtCompetitorsPerformanceOverTimeDataset[] = [];
          const brandFunnelDataSet: IBrandFunnelDataset[] = [];
          const associationsOverTimeDataSet: BtBrandsLineChartDataSet[] = [];
          const brandAndAssociationsOverTimeDataSet: BtBrandAssociationOverTime[] = [];
          const associationsComparedToCompetitorsDataSet: BtAssociationsComparedToCompetitorsDataset[] = [];
          const adAwarenessMainDataSet: LineChartDataSet[] = [];
          const netPromoterScoreMainDataSet: LineChartDataSet[] = [];
          const netPromoterScoreOverTime: BtBrandsLineChartDataSet[] = [];

          const healthInTargetGroupsDataSet: GroupedBarDataSet[] = [];
          const associationsInTargetGroupsDataSet: GroupedBarDataSet[] = [];
          this.reportCustomQuestionsService.resetCustomQuestionsData();
          this.reportCustomQuestionsService.setSegmentAndGenderOptions(this.segmentOptions, this.genderOptions);
          const selectedBrandCurrentQuarterBrandResultModel = data.brandResultModels.find(model => {
            return model.brandId === this.brand.value && model.intervalIndex === currentInterval;
          });

          // const currentBrandTotalResultModel = data.totalBrandResultModels.find(model => {
          //   return model.brandId === this.brand.value;
          // });

          this.test.brands.forEach((brand: BTBrand) => {
            const currentIntervalBrandResultModels = data.brandResultModels.find(
              ({ brandId, intervalIndex }) => brandId === brand.id && intervalIndex === currentInterval
            );
            const previousIntervalBrandResultModels = data.brandResultModels.find(
              ({ brandId, intervalIndex }) => brandId === brand.id && intervalIndex === previousInterval
            );

            const currentBrandCalculations = data.totalBrandResultModels.find(item => item.brandId === brand.id);

            brandHealthOverviewDataSet.push({
              brand,
              currentIntervalBrandResultModels,
              previousIntervalBrandResultModels,
            });


            brandPerformanceOverTime.push(
              TestReportUtils.brandPerformanceOverTimeModels(brand, data.brandResultModels, kpi, this.availableSegments)
            );

            awarenessPerformanceOverTime.push(
              TestReportUtils.awarenessPerformanceOverTimeModels(brand, data.brandResultModels, kpi, this.availableSegments)
            );

            netPromoterScoreOverTime.push(
              TestReportUtils.netPromoterScoreOverTimeModels(brand, data.brandResultModels, this.availableSegments)
            );

            targetGroupPerformanceOverTime.push(
              TestReportUtils.targetGroupPerformanceOverTimeModels(brand, data.brandResultModels, this.availableSegments, kpi)
            );

            brandFunnelDataSet.push(TestReportUtils.brandFunnelModels(brand, currentBrandCalculations, this.segmentOptions.getValue()));

            associationsOverTimeDataSet.push(
              TestReportUtils.associationsOverTimeModels(
                brand,
                data.brandResultModels,
                this.associations$.getValue(),
                this.segmentOptions.getValue()
              )
            );

            adAwarenessMainDataSet.push(TestReportUtils.adAwarenessModels(brand, data.brandResultModels, this.availableSegments));

            netPromoterScoreMainDataSet.push(
              TestReportUtils.netPromoterScoreMainModels(brand, data.recomendations, this.availableSegments)
            );
          });

          // commercialRecognitionDataSet.push({
          //   brand: null,
          //   value:
          //     (data.noAnyComercialRecognition &&
          //       data.noAnyComercialRecognition[currentQuarter] &&
          //       Math.round(data.noAnyComercialRecognition[currentQuarter])) ||
          //     0,
          //   negative: true,
          // });
          this.brands$.getValue().forEach(brand => {
            this.associations$.getValue().forEach(association => {
              const currentBrandTotalResultModel = data.totalBrandResultModels.find(model => model.brandId === brand.id);

              associationsInTargetGroupsDataSet.push({
                brandId: brand.id,
                id: association.id,
                label: association.value,
                values: [
                  TestReportUtils.associationsInTargetGroupsModels(null, currentBrandTotalResultModel, association.id, true),
                  ...this.availableSegments.map(segment =>
                    TestReportUtils.associationsInTargetGroupsModels(segment, currentBrandTotalResultModel, association.id)
                  ),
                ],
              });
            });
          });

          kpi.forEach((value: KPIModel, key: KPITitle) => {
            competitorsPerformanceOverTime.push({
              kpi: key,
              id: value.id,
              dataset: sortBy(
                [...this.test.brands].filter(brand => brand.isOwn),
                'name'
              )
                .concat(
                  sortBy(
                    [...this.test.brands].filter(brand => !brand.isOwn),
                    'name'
                  )
                )
                .map((brand: BTBrand) =>
                  TestReportUtils.competitorsPerformanceOverTimeModels(brand, data.brandResultModels, key, this.availableSegments)
                ),
            });

            healthInTargetGroupsDataSet.push({
              id: value.id,
              label: key,
              values: [
                ...this.availableSegments.map(segment =>
                  TestReportUtils.healthInTargetGroupsModels(segment, selectedBrandCurrentQuarterBrandResultModel, key)
                ),
                {
                  id: 'total',
                  label: 'Population',
                  value: (selectedBrandCurrentQuarterBrandResultModel && Math.round(selectedBrandCurrentQuarterBrandResultModel[key])) || 0,
                },
              ],
            });
          });

          this.associations$.getValue().forEach((association: ListItem) => {
            brandAndAssociationsOverTimeDataSet.push({
              association,
              dataset: this.test.brands.map((brand: BTBrand) =>
                TestReportUtils.brandAndAssociationsOverTimeModels(
                  brand,
                  data.brandResultModels,
                  association.id,
                  this.segmentOptions.getValue()
                )
              ),
            });
            associationsComparedToCompetitorsDataSet.push({
              association,
              dataset: [...this.test.brands]
                .sort((a, b) => (a.isOwn === b.isOwn ? 0 : a.isOwn ? -1 : 1))
                .map((brand: BTBrand) =>
                  TestReportUtils.associationsComparedToCompetitorsModels(brand, data.totalBrandResultModels, association.id)
                ),
              segmentDataset: this.availableSegments?.map(segment => {
                return {
                  segmentId: segment.id,
                  data: [...this.test.brands]
                    .sort((a, b) => (a.isOwn === b.isOwn ? 0 : a.isOwn ? -1 : 1))
                    .map((brand: BTBrand) =>
                      TestReportUtils.associationsComparedToCompetitorsSegmentsModels(
                        brand,
                        data.totalBrandResultModels,
                        association.id,
                        segment.id
                      )
                    ),
                };
              }),
            });
          });

          this.brandHealthOverviewDataSet$.next(brandHealthOverviewDataSet);
          this.brandPerformanceOverTime$.next(brandPerformanceOverTime);
          this.targetGroupPerformanceOverTime$.next(targetGroupPerformanceOverTime);
          this.competitorsPerformanceOverTime$.next(competitorsPerformanceOverTime);
          this.brandFunnelDataSet$.next(brandFunnelDataSet);

          this.intervalTotals$.next(data.intervalTotals);
          this.reportCustomQuestionsService.availableSegments = this.availableSegments;
          this.reportCustomQuestionsService.setIntervalTotals({ ...data.intervalTotals });

          healthInTargetGroupsDataSet.map(item => {
            item.values.unshift(item.values.pop());
          });

          this.healthInTargetGroups$.next(healthInTargetGroupsDataSet);
          this.associationsInTargetGroups$.next(associationsInTargetGroupsDataSet);
          this.adAwarenessMainDataSet$.next(adAwarenessMainDataSet.sort((a, b) => (a.isOwn === b.isOwn ? 0 : a.isOwn ? -1 : 1)));
          this.awarenessPerformanceOverTime$.next(awarenessPerformanceOverTime);
          this.netPromoterScoreOverTime$.next(netPromoterScoreOverTime);
          this.netPromoterScoreMainDataSet$.next(netPromoterScoreMainDataSet.sort((a, b) => (a.isOwn === b.isOwn ? 0 : a.isOwn ? -1 : 1)));
          this.associationsOverTimeDataSet$.next(associationsOverTimeDataSet);
          this.brandAndAssociationsOverTimeDataSet$.next(brandAndAssociationsOverTimeDataSet);
          this.associationsComparedToCompetitorsDataSet$.next(associationsComparedToCompetitorsDataSet);
          this.reportCustomQuestionsService.createDataSetItem(null, {
            ...TestReportUtils.getCustomQuestionsMergeData(data).mergedData,
            orRespondentCount: TestReportUtils.getTotalRespondentCountForCustomQuestions(data.intervalTotals),
          });
          this.reportCustomQuestionsService.setCustomQuestionsDataSet();
          this._refreshChart();
          if (!this.brandFunnelFooterTableAverage$.getValue()) {
            this._getBrandFunnelFooterTableAverage();
          }
        })
      )
      .subscribe();
  }

  private buildFilterForms(test: BTTest, respondentOptions: Partial<RespondentRequirements>, associations: Association[]): void {
    test.btTestAssociations = test.btTestAssociations.map(item => {
      item.text = associations.find(el => el.id === item.id).text;
      return item;
    });
    const { brands, testKPIs, respondentRequirements, btTestAssociations, customAssociations }: BTTest = (this.test = test);
    respondentRequirements.segments.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
    this.test = test;
    this.purchaseFrequencyCategoryId = this.getPurchaseFrequencyCategoryId();
    /*Set brands options and initial value*/
    this.brand.setValue(this.setBrandOptions(TestReportUtils.divideBrands(brands)));
    /*Set Age values*/
    this.setAge(respondentRequirements);
    /*Available gender options*/
    this.setRespondentOptions(respondentRequirements, respondentOptions);
    /*Available market options*/
    this.setMarketOptions(respondentRequirements);
    /*Available segment options*/
    this.setSegmentOptions(respondentRequirements);
    /*Available Purchase/usage frequency options*/
    this.setPurchaseFrequenciesOptions(respondentOptions as RespondentOptions);
    /*Set test associations*/
    this.setTestAssociations(btTestAssociations, customAssociations);
    /*Defined Respondent Overview Data*/
    this.setRespondentOverview(respondentRequirements);

    /*KPI for benchmarks*/
    const allKpis = [];

    testKPIs.forEach(kpi => {
      allKpis.push(kpi.id);
      this.hashMap.set(kpi.title, kpi);

      // KPI for MovingAverage
      const modifiedTitle = 'toggle' + kpi.title.charAt(0).toUpperCase() + kpi.title.slice(1) as KPITitle;
      const modifiedKpi = {
        ...kpi,
        title: modifiedTitle
      }
        ;
      this.movingAverageHash.set(modifiedTitle, modifiedKpi);
    });

    this.kpiMap.next(this.hashMap);
    this.test.brands.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }

  private setAge({ minAge = 18, maxAge = 75 }: RespondentRequirements): void {
    this.min = minAge;
    this.max = maxAge;
    /*Add here all controls*/
    const minAgeControls = [this.brandHealthDemography.get('age'), this.commercialRecognitionDemography.get('age')];
    minAgeControls.forEach(control =>
      control.setValue(
        AGE_GROUPS_FOR_REPORT.filter(
          item => (item.min >= this.min && item.min <= this.max) || (item.min <= this.min && item.max >= this.min)
        ).map(item => omit(item, ['name', 'id']))
      )
    );
  }

  private setRespondentOptions({ genders }: RespondentRequirements, respondentOptions: Partial<RespondentRequirements>): void {
    if (genders.length) {
      const genderOptions = genders.map(item => {
        item.value = respondentOptions.genders.find(el => el.id === item.id).value;
        return item;
      });
      this.genderOptions.next(genderOptions);
      /*Add here all controls*/
      const gendersControls = [this.brandHealthDemography.get('genders'), this.commercialRecognitionDemography.get('genders')];
      /*if test has gender options - set required validator*/
      gendersControls.forEach(control => {
        TestReportUtils.setRequiredValidator(control as FormControl);
        control.setValue(genders);
      });
    }
  }

  private setMarketOptions({ countries, subdivisions }: RespondentRequirements): void {
    const marketOptions: TreeMultiselectOptionsModel[] = countries.map(({ id, value }: Country) => {
      return {
        label: value,
        value: id,
        items: subdivisions.filter(({ countryId }) => countryId === id).map(item => ({ value: item.id, label: item.value })),
      };
    });
    this.marketOptions.next(marketOptions);
    /*Add here all controls*/
    const marketsControls = [this.brandHealthDemography.get('markets'), this.commercialRecognitionDemography.get('markets')];
    marketsControls.forEach(control => control.setValue(subdivisions.map(({ id }) => id)));
  }

  private setSegmentOptions({ segments, isSegmentation, isCustomSegmentation, customSegments }: RespondentRequirements): void {
    if (!isSegmentation && !isCustomSegmentation) {
      return;
    }
    const segmentOptions = isCustomSegmentation ? [...customSegments] : [...segments];
    if (segmentOptions.length) {
      this.segmentOptions.next(segmentOptions);
      /*Add here all controls*/
      const segmentsControls = [this.brandHealthDemography.get('segments'), this.commercialRecognitionDemography.get('segments')];
      /*if test has segments options - set required validator*/
      segmentsControls.forEach(control => {
        TestReportUtils.setRequiredValidator(control as FormControl);
        control.setValue(segmentOptions);
      });
    }
  }

  private setPurchaseFrequenciesOptions(res: RespondentOptions): void {
    this.purchaseFrequenciesOptions.next(res.purchaseFrequencies);

    // if (purchaseFrequencies.length) {
    //   const purchaseFrequenciesOptions = purchaseFrequencies.map((item) => {
    //     item.value = respondentOptions.purchaseFrequencies.find(
    //       (el) => el.id === item.id
    //     ).value;
    //     return item;
    //   });
    //   this.purchaseFrequenciesOptions.next(purchaseFrequenciesOptions);
    //   /*Add here all controls*/
    //   const purchaseFrequenciesControls = [
    //     this.brandHealthDemography.get('purchaseFrequencies'),
    //     this.associationsDemography.get('purchaseFrequencies'),
    //     this.commercialRecognitionDemography.get('purchaseFrequencies'),
    //   ];
    //   /*if test has purchaseFrequencies options - set required validator*/
    //   purchaseFrequenciesControls.forEach((control) => {
    //     TestReportUtils.setRequiredValidator(control as FormControl);
    //     control.setValue(purchaseFrequencies);
    //   });
    // }
  }

  private setTestAssociations(btTestAssociations: BtTestAssociation[], customAssociations: BtCustomAssociation[]): void {
    const associations: ListItem[] = [
      ...btTestAssociations.map(({ id, text }: BtTestAssociation) => ({
        id,
        value: text,
      })),
      ...customAssociations.map(({ id, value }: BtCustomAssociation) => ({
        id,
        value,
      })),
    ];
    this.associations$.next(associations);
  }

  /*Form Controls*/
  public get brand(): FormControl {
    return this.form.get('brand') as FormControl;
  }

  public get brandHealthComparedToCompetitorsFilter(): FormControl {
    return this.form.get('brandHealthComparedToCompetitorsFilter') as FormControl;
  }

  public get brandHealthDemography(): FormGroup {
    return this.form.get('brandHealthDemography') as FormGroup;
  }

  public get commercialRecognitionDemography(): FormGroup {
    return this.form.get('commercialRecognitionDemography') as FormGroup;
  }

  private setBrandOptions({ ownBrands, competitorsBrands }): string {
    const own = ownBrands.map(({ id, name, color }: BTBrand) => ({
      id,
      value: name,
      color,
    }));
    const competitors = competitorsBrands.map(({ id, name, color }: BTBrand) => ({
      id,
      value: name,
      color,
    }));
    this.brands$.next([...own, ...competitors]);
    this.brandHealthComparedToCompetitorsFilter.setValue([...own, ...competitors].map(({ id }) => id));
    this.ownBrands.next(own);
    this.competitorsBrands.next(competitors);

    this.brandHealthComparedToCompetitorsObservables();

    return ownBrands[0].id;
  }

  public getKpiOptions(): Observable<ListItem[]> {
    return this.kpiMap.asObservable().pipe(
      map((hashMap: Map<KPITitle, KPIModel>) => {
        const options: ListItem[] = [];
        hashMap.forEach(({ id, title }: KPIModel) => options.push({ id, value: KPI_NAME[title] }));
        return options;
      })
    );
  }

  private get demographyFormGroup(): FormGroup {
    return this.formBuilder.group({
      // minAge: [null, [Validators.required]],
      // maxAge: [null, [Validators.required]],
      age: [[], [Validators.required]],
      genders: [[]],
      markets: [[], [Validators.required]],
      segments: [[]],
      purchaseFrequencies: [[]],
      purchaseInvolvements: [[]],
    });
  }

  private brandHealthComparedToCompetitorsObservables(): void {
    const filter$ = this.brandHealthComparedToCompetitorsFilter.valueChanges.pipe(
      filter(value => !!value),
      startWith(this.brandHealthComparedToCompetitorsFilter.value as string[]),
      shareReplay()
    );

    /*rebuild component*/
    const firstTrigger = filter$.pipe(map(() => null));
    const secondTrigger = filter$.pipe(delay(0));

    this.itemWidth$ = merge(firstTrigger, secondTrigger).pipe(
      map(selection => {
        if (!selection) {
          return null;
        }
        if (this.document.body.offsetWidth <= 767) {
          return '100%';
        } else if (selection.length <= 5) {
          return '31%';
        } else if (selection.length >= 10) {
          return '100%';
        } else {
          return '48%';
        }
      })
    );

    this.spontaneousAwareness$ = this.filteredDataSet(filter$, 'spontaneousAwareness');
    this.topOfMindSpontaneousAwareness$ = this.filteredDataSet(filter$, 'topOfMindSpontaneousAwareness');
    this.aidedAwareness$ = this.filteredDataSet(filter$, 'aidedAwareness');
    this.consideration$ = this.filteredDataSet(filter$, 'consideration');
    this.preference$ = this.filteredDataSet(filter$, 'preference');
    this.penetration$ = this.filteredDataSet(filter$, 'penetration');
  }

  private filteredDataSet(trigger$: Observable<any>, field: string): Observable<BarDataSetModel[]> {
    return trigger$.pipe(
      map(() => {
        const dataSetValues = this.brandFunnelDataSet$.getValue();
        return this.brandHealthComparedToCompetitorsFilter.value.map(id => {
          const el = dataSetValues.find(({ brand }) => brand.id === id);
          return {
            id,
            label: el.brand.name,
            value: el[field],
            isOwn: el.brand.isOwn,
          };
        });
      })
    );
  }

  public addHealthInTargetGroupsFilterSubscription(): Observable<any> {
    return merge(
      this.healthInTargetGroupsFilterSource.asObservable(),
      this.brandHealthDemography.get('age').valueChanges,
      // this.brandHealthDemography.get('maxAge').valueChanges,
      this.brand.valueChanges
    ).pipe(
      debounceTime(1000),
      filter(() => this.brandHealthDemography.valid),
      switchMap(() => this.fetchTestResult(this.brandHealthDemography.value)),
      tap(({ brandResultModels }: BtTestResultModel) => {
        const healthInTargetGroupsDataSet: GroupedBarDataSet[] = [];
        const currentQuarter = TestReportUtils.getAbsQuarter(new Date());
        const selectedBrandCurrentQuarterBrandResultModel = brandResultModels.find(model => {
          return model.brandId === this.brand.value && model.intervalIndex === currentQuarter;
        });
        const currentSelection = this.brandHealthDemography.get('segments').value.map(item => item.id);
        this.kpiMap.getValue().forEach((value: KPIModel, key: KPITitle) => {
          healthInTargetGroupsDataSet.push({
            id: value.id,
            label: key,
            values: [
              ...this.availableSegments
                .filter((segment: ListItem) => currentSelection.includes(segment.id))
                .map(segment => TestReportUtils.healthInTargetGroupsModels(segment, selectedBrandCurrentQuarterBrandResultModel, key)),
              {
                id: 'total',
                label: 'Population',
                value: (selectedBrandCurrentQuarterBrandResultModel && Math.round(selectedBrandCurrentQuarterBrandResultModel[key])) || 0,
              },
            ],
          });
        });
        this.healthInTargetGroups$.next(healthInTargetGroupsDataSet);
      })
    );
  }

  public getIntervalTotalsPopulationLow(): boolean {
    return TestReportUtils.getIntervalTotalsPopulationLow(this.intervalTotals$.getValue());
  }

  public getIntervalTotalsSegmentLow(segmentId?: string): boolean {
    return TestReportUtils.getIntervalTotalsSegmentLow(this.availableSegments, this.intervalTotals$.getValue(), segmentId);
  }

  public getIntervalTotalsMultiSegmentLow(segments: Record<string, boolean>): boolean {
    let summ = 0;
    forIn(this.intervalTotals$.getValue(), (interval: IntervalTotalItem) => {
      Object.keys(segments).forEach(key => {
        if (segments[key]) {
          summ += interval.segmentTotals[key] ?? 0;
        }
      });
    });
    return summ < LOW_NUMBER_OF_RESPONDENTS;
  }

  private fetchTestResult(payload): Observable<BtTestResultModel> {
    const {
      segments,
      genders,
      // minAge,
      // maxAge,
      age,
      markets,
      purchaseFrequencies,
      purchaseInvolvements,
    } = payload;
    const model: TestResultFilterModel = {
      brand: this.brand.value,
      segments: TestReportUtils.mapIds(segments),
      genderIds: TestReportUtils.mapIds(genders),
      age,
      // ageFrom: minAge,
      // ageTo: maxAge,
      regions: markets,
      purchaseFrequencyIds: TestReportUtils.mapIds(purchaseFrequencies),
      purchaseInvolvementIds: TestReportUtils.mapIds(purchaseInvolvements),
      purchaseFrequencyCategoryId: this.purchaseFrequencyCategoryId,
    };
    return this.testResultService.getBTTestResultByFilter(model, this.test.id);
  }

  private setRespondentOverview({ countries, subdivisions, genders, minAge, maxAge, segments }: RespondentRequirements): void {
    const data: RespondentOverviewModel = {
      timePeriodForTesting: this.timePeriodForTesting,
      markets:
        TestReportUtils.marketsOptionsHtml(countries, subdivisions, this.appStateService.countries.getValue(), this.translateService) ||
        null,
      nrOfRespondents: this.nrOfRespondents,
      genders: TestReportUtils.arrayValuesToString(genders) || null,
      age: `${minAge} - ${maxAge}`,
      segments: TestReportUtils.arrayValuesToString(segments) || null,
      // purchaseUsageFrequency:
      //   TestReportUtils.arrayValuesToString(purchaseFrequencies) || null,
    };
    this.definedRespondentOverview.next(data);
  }

  private get timePeriodForTesting(): string {
    const { startDate, endDate } = this.test;
    const start = this.translateService.instant('report.Start');
    const end = this.translateService.instant('report.End');
    return `${start}: ${formatDate(new Date(startDate), 'y-MM-dd', 'en-US')} ${end}: ${formatDate(new Date(endDate), 'y-MM-dd', 'en-US')}`;
  }

  private get nrOfRespondents(): string {
    const { requieredNumberRespondent } = this.test;
    return `${requieredNumberRespondent}`;
  }

  private get availableSegments(): ListItem[] {
    let availableSegments: ListItem[] = [];
    const { isCustomSegmentation, customSegments, isSegmentation, segments } = this.test.respondentRequirements;
    if (isCustomSegmentation) {
      availableSegments = [...customSegments];
    }
    if (isSegmentation) {
      availableSegments = [...availableSegments, ...segments];
    }
    if (!isCustomSegmentation && !isSegmentation) {
      /*improvement 1642*/
      // availableSegments = segments.filter(el => el.value === 'Other');
    }
    return availableSegments;
  }

  private getPurchaseFrequencyCategoryId(): string {
    return this.test.respondentRequirements.involvementId === NO_ORDER_ID
      ? this.test.respondentRequirements.involvementCategoryId
      : this.test.respondentRequirements.involvementId;
  }

  private _refreshChart(): void {
    this.switcher$.next(false);
    setTimeout(() => this.switcher$.next(true));
  }

  private _getBrandFunnelFooterTableAverage(): void {
    const dataset: INewBrandFunnelDatasetItem[] = this.brandFunnelDataSet$.getValue().map(item => {
      return {
        brand: item.brand,
        ...item.dataset.find(segment => !segment.segmentId),
      };
    });
    this.brandFunnelFooterTableAverage$.next({
      aidedAwarenessToConsideration: TestReportUtils.getAverage('aidedAwarenessToConsideration', cloneDeep(dataset)),
      considerationToPreference: TestReportUtils.getAverage('considerationToPreference', cloneDeep(dataset)),
      aidedAwarenessToPenetration: TestReportUtils.getAverage('aidedAwarenessToPenetration', cloneDeep(dataset)),
    });
  }
}
