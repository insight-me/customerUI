import { formatDate } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { omit, orderBy } from 'lodash';
import { BehaviorSubject, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { AGE_GROUPS_FOR_REPORT, NO_ORDER_ID } from '../../../../assets/consts/consts';
import { IN_PERCENTS } from '../../../../assets/consts/test-creation.const';
import { PurchaseValues } from '../../../shared/enums/bic.report.purchase.type';
import { TotalRelevanceType } from '../../../shared/enums/bic.report.relevance.type';
import { ConsumerInsightsTapType } from '../../../shared/enums/consumer.insights.tap.type';
import { AssociationsScoreDataModel } from '../../../shared/models/bic.test.report/association.score.data.model';
import { AssociationsPerConceptModel } from '../../../shared/models/bic.test.report/associations.per.concept.model';
import { BarDataSetModel } from '../../../shared/models/bic.test.report/bar.data.set.model';
import { BubbleDataSetModel } from '../../../shared/models/bic.test.report/bubble.data.set.model';
import { ConceptBenefitsReasonsModel } from '../../../shared/models/bic.test.report/concept.benefits.reasons.model';
import { ConceptScorePerSegmentModel } from '../../../shared/models/bic.test.report/concept.score.per.segment.model';
import { ConsumerInsightModel } from '../../../shared/models/bic.test.report/consumer.insight.model';
import { GroupedBarDataSet, KPIWithGroupedBarDataSet } from '../../../shared/models/bic.test.report/grouped.bar.data.set';
import { KPIModel, KPITitle } from '../../../shared/models/bic.test.report/KPIModel';
import { RespondentOverviewModel, SegmentsPerCountries } from '../../../shared/models/bic.test.report/respondent.overview.model';
import {
  AccumulatedAssociation,
  AccumulatedBenefits,
  AccumulatedReasons,
} from '../../../shared/models/bic.test.report/test.concept.result.model';
import { TestResultFilterModel } from '../../../shared/models/bic.test.report/test.result.filter.model';
import { TestResultModel } from '../../../shared/models/bic.test.report/test.result.model';
import { TotalRelevanceModel } from '../../../shared/models/bic.test.report/total.relevance.model';
import { BtCustomAssociation, BtTestAssociation } from '../../../shared/models/bt-test.model';
import { RespondentOptions, Segment } from '../../../shared/models/test-creation.model';
import {
  Association,
  Country,
  Involment,
  ListItem,
  RespondentRequirements,
  SegmentRespondent,
  Test,
  TestConcept,
} from '../../../shared/models/test.model';
import { TreeMultiselectOptionsModel } from '../../../shared/models/tree.multiselect.options.model';
import { AppStateService } from '../../../shared/services/app-state/app-state.service';
import { BicTestService } from '../../../shared/services/bic-test/bic-test.service';
import { BtTestService } from '../../../shared/services/bt-test/bt-test.service';
import { TestCreationUtils } from '../../../shared/utils/test.creation.utils';
import { TestReportUtils } from '../../../shared/utils/test.report.utils';
import { CustomValidator } from '../../../shared/validators/custom.validator';
import { TestStateService } from '../test.state.service';

@Injectable()
export class BicReportStateService extends TestStateService<Test> {
  public form: FormGroup = this.formBuilder.group({
    concepts: this.formBuilder.array([], [CustomValidator.atLeastOneFromArray]),
    age: [[], [Validators.required]],
    genders: [[]],
    markets: [[], [Validators.required]],
    segments: [[]],
    purchaseFrequencies: [[]],
  });

  public filterSource: Subject<void> = new Subject<void>();
  public allPurchaseFrequencies;
  public purchaseFrequencyCategoryId: string;

  /*Dashboard data*/
  public purchaseIntentUniquenessDataSet$: BehaviorSubject<BubbleDataSetModel[]> = new BehaviorSubject<BubbleDataSetModel[]>(null);
  public likeabilityTrustworthinessDataSet$: BehaviorSubject<BubbleDataSetModel[]> = new BehaviorSubject<BubbleDataSetModel[]>(null);
  public purchaseIntentDataSet$: BehaviorSubject<BarDataSetModel[]> = new BehaviorSubject<BarDataSetModel[]>(null);
  public uniquenessDataSet$: BehaviorSubject<BarDataSetModel[]> = new BehaviorSubject<BarDataSetModel[]>(null);

  /*Respondent Overview data*/
  public definedRespondentOverview: BehaviorSubject<RespondentOverviewModel> = new BehaviorSubject<RespondentOverviewModel>(null);
  public appliedRespondentOverview: BehaviorSubject<RespondentOverviewModel> = new BehaviorSubject<RespondentOverviewModel>(null);

  /*Concept definition data*/
  public consumerInsightTabIndex: ConsumerInsightsTapType = ConsumerInsightsTapType.WordCloud;
  public consumerInsightDataSet$: BehaviorSubject<ConsumerInsightModel[]> = new BehaviorSubject<ConsumerInsightModel[]>(null);
  public pdfMoodboardDataSet$: BehaviorSubject<ConsumerInsightModel[]> = new BehaviorSubject<ConsumerInsightModel[]>(null);
  public benefitsDataSet$: BehaviorSubject<ConceptBenefitsReasonsModel[]> = new BehaviorSubject<ConceptBenefitsReasonsModel[]>(null);
  public reasonsToBelieveDataSet$: BehaviorSubject<ConceptBenefitsReasonsModel[]> = new BehaviorSubject<ConceptBenefitsReasonsModel[]>(
    null
  );
  public consumerInsightRelevanceDataSet$: BehaviorSubject<ConceptBenefitsReasonsModel> = new BehaviorSubject<ConceptBenefitsReasonsModel>(
    null
  );
  public totalRelevanceDataSet$: BehaviorSubject<TotalRelevanceModel[]> = new BehaviorSubject<TotalRelevanceModel[]>(null);

  /*Brand andBusiness KPIs*/
  public purchaseIntentPerSegmentDataSet$: BehaviorSubject<KPIWithGroupedBarDataSet[]> = new BehaviorSubject<KPIWithGroupedBarDataSet[]>(
    null
  );
  public kpisWithGroupedBarDataSet$: BehaviorSubject<KPIWithGroupedBarDataSet[]> = new BehaviorSubject<KPIWithGroupedBarDataSet[]>(null);
  public selectedKPIWithGroupedBarDataSet$: BehaviorSubject<KPIWithGroupedBarDataSet> = new BehaviorSubject<KPIWithGroupedBarDataSet>(null);
  public kpis$: BehaviorSubject<KPITitle[]> = new BehaviorSubject<KPITitle[]>(null);
  public selectedKPI$: BehaviorSubject<KPITitle> = new BehaviorSubject<KPITitle>(KPITitle.PurchaseIntent);
  public scorePerSegmentDataSet$: BehaviorSubject<ConceptScorePerSegmentModel[]> = new BehaviorSubject<ConceptScorePerSegmentModel[]>(null);
  public whatDrivesDataSet$: BehaviorSubject<GroupedBarDataSet[]> = new BehaviorSubject<GroupedBarDataSet[]>(null);
  public purchaseFrequenciesDataSet$: BehaviorSubject<BarDataSetModel[]> = new BehaviorSubject<BarDataSetModel[]>(null);
  public scorePerConceptDataSet$: BehaviorSubject<ConceptScorePerSegmentModel[]> = new BehaviorSubject<ConceptScorePerSegmentModel[]>(null);

  /*Associations data*/
  public associations$: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>(null);
  public associationsDataSet$: BehaviorSubject<AssociationsPerConceptModel[]> = new BehaviorSubject<AssociationsPerConceptModel[]>(null);

  public associationScorePrecentDataSet$: BehaviorSubject<AssociationsScoreDataModel> = new BehaviorSubject<AssociationsScoreDataModel>(
    null
  );

  public associationScoreIndexDataSet$: BehaviorSubject<AssociationsScoreDataModel> = new BehaviorSubject<AssociationsScoreDataModel>(null);

  public categoryData$: BehaviorSubject<{
    categoryName: string;
    subCategoryName: string;
  }> = new BehaviorSubject<{ categoryName: string; subCategoryName: string }>(null);

  public canExportPDF$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public testSource$: BehaviorSubject<string> = new BehaviorSubject('');

  private allSegments: boolean;

  constructor(
    private bicTestService: BicTestService,
    private appStateService: AppStateService,
    private btTestService: BtTestService,
    protected injector: Injector
  ) {
    super(injector);
    this.appStateService.getCountries();
  }

  /*Form Controls*/
  public get concepts(): FormArray {
    return this.form.get('concepts') as FormArray;
  }

  public get age(): FormControl {
    return this.form.get('age') as FormControl;
  }

  public get genders(): FormControl {
    return this.form.get('genders') as FormControl;
  }

  public get markets(): FormControl {
    return this.form.get('markets') as FormControl;
  }

  public get segments(): FormControl {
    return this.form.get('segments') as FormControl;
  }

  public get purchaseFrequencies(): FormControl {
    return this.form.get('purchaseFrequencies') as FormControl;
  }

  private get timePeriodForTesting(): string {
    const { startDate, endDate } = this.test;
    const start = this.translateService.instant('report.Start');
    const end = this.translateService.instant('report.End');
    return `${start}: ${formatDate(new Date(startDate), 'y-MM-dd', 'en-US')} ${end}: ${formatDate(new Date(endDate), 'y-MM-dd', 'en-US')}`;
  }

  private get nrOfRespondents(): string {
    const { requieredNumberRespondent, numberRespondents } = this.test;
    return `${numberRespondents} of ${requieredNumberRespondent}`;
  }

  public getTestById(id: string): Observable<Test> {
    this.resetData();
    return this.bicTestService.getTestById(id).pipe(
      filter(value => !!value),
      tap(test => {
        this.reportCustomQuestionsService.resetCustomQuestionsData();
        this.reportCustomQuestionsService.setTest(test);
      }),
      map((test: Test) => {
        TestReportUtils.addOtherSegment(test.respondentRequirements);
        TestReportUtils.changeOtherSegmentToPopulation(test.respondentRequirements);
        /** uncomment if KPI was broken */
        // test.testKPIs = KPI_MOCK;
        return test;
      }),
      switchMap(test =>
        forkJoin([this.testService.getRespondentOptions(test.sv), this.bicTestService.getAssociations()]).pipe(
          tap(([respondentOptions, associations]) => {
            TestReportUtils.changeOtherSegmentToPopulation(respondentOptions);
            test.respondentRequirements.segments = TestReportUtils.translateSegments(
              test.respondentRequirements.segments,
              respondentOptions.segments
            );
            this.getTestSource(test);
            this.allSegments = test.respondentRequirements.allSegments;
            this.buildFilterForms(test, respondentOptions, associations);
            this.allPurchaseFrequencies = respondentOptions.purchaseFrequencies;
          }),
          map(() => test)
        )
      )
    );
  }

  public getReportData(filterParam?: Record<string, any>): Observable<TestResultModel> {
    const filterSource$ = merge(this.filterSource.asObservable(), this.age.valueChanges).pipe(
      debounceTime(1000),
      filter(() => this.form.valid)
    );
    const initSource$ = of(null);
    return merge(filterSource$, initSource$).pipe(
      tap(this.setAppliedRespondentOverview.bind(this)),
      switchMap(() => this.fetchTestResult(filterParam)),
      tap(this.getDataSets.bind(this))
    );
  }

  public getBenchmark(kpiTitle: KPITitle): Observable<number> {
    return this.kpiMap.asObservable().pipe(
      filter(val => !!val),
      map((kpi: Map<KPITitle, KPIModel>) => {
        const model = kpi.get(kpiTitle);
        return model ? model.benchmarkValue : 0;
      })
    );
  }

  public brandAndBuisnessSelectKpi(selectedKPI: KPITitle): void {
    this.selectedKPI$.next(selectedKPI);
    this._updateKPIWithGroupedBarDataSetBySelectedKPI();
  }

  private _updateKPIWithGroupedBarDataSetBySelectedKPI(): void {
    const dataSet = this.kpisWithGroupedBarDataSet$.value?.find(
      kpiWithGroupedBarDataSet => kpiWithGroupedBarDataSet.kpi === this.selectedKPI$.value
    );

    dataSet.groupedBarDataSetPerPage = TestReportUtils.splitArrayOnPages(dataSet?.groupedBarDataSet, 5);

    this.selectedKPIWithGroupedBarDataSet$.next(dataSet);
  }

  private buildFilterForms(test: Test, respondentOptions: Partial<RespondentRequirements>, associations: Association[]): void {
    test.testAssociations = test.testAssociations.map(item => {
      item.text = associations.find(el => el.id === item.id).text;
      return item;
    });
    this.setTestAssociations(test.testAssociations, test.customAssociations);
    this.setPurchaseFrequenciesOptions(respondentOptions as RespondentOptions);
    const { respondentRequirements, testKPIs, concepts } = test;
    respondentRequirements.segments.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
    respondentRequirements.customSegments.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
    concepts.sort((a, b) => {
      if (a.conceptName.toLowerCase() > b.conceptName.toLowerCase()) {
        return 1;
      }
      if (a.conceptName.toLowerCase() < b.conceptName.toLowerCase()) {
        return -1;
      }
      return 0;
    });
    this.test = test;
    this.getSubCategory(test.respondentRequirements);
    this.purchaseFrequencyCategoryId = this.getPurchaseFrequencyCategoryId();
    /*Array of available concepts*/
    test.concepts.forEach((concept: TestConcept) => {
      this.concepts.push(this.conceptFormGroup(concept));
    });
    /*Set Age values*/
    this.setAge(respondentRequirements);
    /*Available gender options*/
    this.setRespondentOptions(respondentRequirements, respondentOptions);
    /*Available market options*/
    this.setMarketOptions(respondentRequirements);
    /*Available segment options*/
    this.setSegmentOptions(respondentRequirements);
    /*Available Purchase/usage frequency options*/
    // this.setPurchaseFrequenciesOptions(
    //   respondentRequirements,
    //   respondentOptions
    // );
    /*Defined Respondent Overview Data*/
    this.setRespondentOverview(respondentRequirements);
    /*KPI for benchmarks*/
    const hashMap = new Map<KPITitle, KPIModel>();
    testKPIs.forEach(kpi => hashMap.set(kpi.title, kpi));
    this.kpiMap.next(hashMap);
  }

  private setPurchaseFrequenciesOptions(res: RespondentOptions): void {
    this.purchaseFrequenciesOptions.next(res.purchaseFrequencies);
  }

  private setTestAssociations(testAssociations: BtTestAssociation[], customAssociations: BtCustomAssociation[]): void {
    const associations: ListItem[] = [
      ...testAssociations.map(({ id, text }: BtTestAssociation) => ({
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

  private conceptFormGroup({ id, conceptName }: TestConcept): FormGroup {
    return this.formBuilder.group({
      id,
      conceptName,
      isSelected: true,
    });
  }

  private setAge({ minAge = 18, maxAge = 75 }: RespondentRequirements): void {
    this.min = minAge;
    this.max = maxAge;
    this.age.setValue(
      AGE_GROUPS_FOR_REPORT.filter(
        item => (item.min >= this.min && item.min <= this.max) || (item.min <= this.min && item.max >= this.min)
      ).map(item => omit(item, ['name', 'id']))
    );
  }

  private setRespondentOptions({ genders }: RespondentRequirements, respondentOptions: Partial<RespondentRequirements>): void {
    if (genders.length) {
      const genderOptions = genders.map(item => {
        item.value = respondentOptions.genders.find(el => el.id === item.id).value;
        return item;
      });
      this.genderOptions.next(genderOptions);
      /*if test has gender options - set required validator*/
      TestReportUtils.setRequiredValidator(this.genders);
      this.genders.setValue(genders);
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
    this.markets.setValue(subdivisions.map(({ id }) => id));
  }

  private setSegmentOptions({ segments, customSegments, isCustomSegmentation, isSegmentation }: RespondentRequirements): void {
    if (!isCustomSegmentation && !isSegmentation) {
      return;
    }
    const segmentOptions = [...(isCustomSegmentation ? customSegments : segments)];
    if (segmentOptions.length) {
      const filteredOptions = segmentOptions.filter(segment => segment.value !== 'Population');
      this.segmentOptions.next(filteredOptions);
      /*if test has segments options - set required validator*/
      TestReportUtils.setRequiredValidator(this.segments);
      this.segments.setValue(filteredOptions);
    }
  }

  /** Respondent Overview */
  private setRespondentOverview({
    countries,
    subdivisions,
    genders,
    minAge,
    maxAge,
    segments,
    customSegments,
    isCustomSegmentation,
    isSegmentation,
    allSegments,
    respondentRequirementSegmentCounts,
  }: RespondentRequirements): void {
    const data: RespondentOverviewModel = {
      timePeriodForTesting: this.timePeriodForTesting,
      markets:
        TestReportUtils.marketsOptionsHtml(countries, subdivisions, this.appStateService.countries.getValue(), this.translateService) ||
        null,
      nrOfRespondents: this.nrOfRespondents,
      genders: TestReportUtils.arrayValuesToString(genders) || null,
      age: `${minAge} - ${maxAge}`,
      segments: allSegments
        ? isCustomSegmentation
          ? this.translateService.instant('report.My own consumer segments - All segments')
          : this.translateService.instant('report.InsightMe - All segments')
        : !this.test.respondentRequirements.isCustomSegmentation && !this.test.respondentRequirements.isSegmentation
        ? null
        : TestReportUtils.arrayValuesToString([
            ...(isCustomSegmentation ? customSegments : segments.filter(segment => segment.value !== 'Population')),
          ]) || null,
      segmentsPerCountries: this.getSegmentsPerCountries(
        countries,
        isCustomSegmentation ? customSegments : segments.filter(segment => segment.value !== 'Population'),
        respondentRequirementSegmentCounts,
        isSegmentation,
        isCustomSegmentation,
        allSegments
      ),
      estimatedIR: Math.round(this.test.estimatedIR * IN_PERCENTS < 1 ? 1 : this.test.estimatedIR * IN_PERCENTS),
      actualIR: Math.round(this.test.actualIR < 1 ? 1 : this.test.actualIR),
      isActualIR:
        this.test.requieredNumberRespondent === this.test.numberRespondents ||
        this.test.numberRespondents > this.test.requieredNumberRespondent,
    };
    this.definedRespondentOverview.next(data);
  }

  private getSegmentsPerCountries(
    countries: Country[],
    segments: Segment[],
    respondentRequirementSegmentCounts: SegmentRespondent[],
    isSegmentation: boolean,
    isCustomSegmentation: boolean,
    isAllSegments
  ): SegmentsPerCountries[] {
    const segmentsPerCountriesArr = [];
    if (!respondentRequirementSegmentCounts.length || (!isCustomSegmentation && !isSegmentation) || isAllSegments) {
      countries.forEach(country => {
        segmentsPerCountriesArr.push({
          country: country.value,
          numberOfResp: country.respondentCount,
          segments: [],
        });
      });
    } else {
      countries.forEach(country => {
        const arrElem = {
          country: country.value,
          numberOfResp: country.respondentCount,
          segments: [],
        };
        segmentsPerCountriesArr.push(arrElem);
        segments.forEach(segment => {
          const segmentPerCountry = respondentRequirementSegmentCounts.find(
            item => item.countryId === country.id && item.segmentId === segment.id
          );
          arrElem.segments.push(`${segment.value} - ${segmentPerCountry?.respondentCount}`);
        });
        arrElem.segments.unshift(`${this.translateService.instant('report.Population')} - ${country.populationCount}`);
      });
    }
    return segmentsPerCountriesArr;
  }

  private getSubCategory(respondentRequirements: RespondentRequirements): void {
    const categoryData = {
      categoryName: '',
      subCategoryName: '',
    };
    this.btTestService
      .getInvolvementCategory()
      .pipe(
        switchMap(categories => {
          categoryData.categoryName = categories.find(cat => cat.id === respondentRequirements.involvementCategoryId)?.isOther
            ? respondentRequirements.customCategory.categoryName
            : categories.find(cat => cat.id === respondentRequirements.involvementCategoryId)?.name;
          return this.btTestService.getInvolvement(respondentRequirements.involvementCategoryId);
        })
      )
      .subscribe(subcategories => {
        categoryData.subCategoryName = orderBy(
          this.test.respondentRequirements.involvements
            .map(inv => {
              return {
                ...inv,
                value: TestCreationUtils.getSubcategoryName(inv, subcategories),
              } as Involment;
            })
            .concat(this.test.respondentRequirements.customInvolvements),
          name => name.value.toLowerCase()
        )
          .map(item => item.value)
          .join(', ');
        this.categoryData$.next(categoryData);
      });
  }

  private setAppliedRespondentOverview(): void {
    const { markets, genders, age, segments } = this.form.value;
    let segmentsValue;
    if (
      this.allSegments &&
      this.test.respondentRequirements.isCustomSegmentation &&
      segments.length === this.test.respondentRequirements.customSegments.length
    ) {
      segmentsValue = this.translateService.instant('report.My own consumer segments - All segments');
    } else {
      if (
        this.allSegments &&
        this.test.respondentRequirements.isSegmentation &&
        segments.length === this.test.respondentRequirements.segments.length - 1
      ) {
        segmentsValue = this.translateService.instant('report.InsightMe - All segments');
      } else {
        segmentsValue = TestReportUtils.arrayValuesToString(
          orderBy(segments, 'value', 'asc').filter(segment => segment.value !== 'Population')
        );
      }
    }

    const data: RespondentOverviewModel = {
      timePeriodForTesting: this.timePeriodForTesting,
      markets:
        TestReportUtils.marketsOptionsByFormValueHtml(
          this.test.respondentRequirements.countries,
          this.test.respondentRequirements.subdivisions,
          markets,
          this.appStateService.countries.getValue(),
          this.translateService
        ) || '-',
      nrOfRespondents: this.nrOfRespondents,
      genders: TestReportUtils.arrayValuesToString(genders) || null,
      age: age
        .map(item => Object.values(item).join(' - '))
        .sort()
        .join(', '),
      segments: segmentsValue,
      // purchaseUsageFrequency:
      //   TestReportUtils.arrayValuesToString(purchaseFrequencies) || null,
      segmentsPerCountries: this.getSegmentsPerCountries(
        this.test.respondentRequirements.countries,
        orderBy(segments, 'value', 'asc'),
        this.test.respondentRequirements.respondentRequirementSegmentCounts,
        this.test.respondentRequirements.isSegmentation,
        this.test.respondentRequirements.isCustomSegmentation,
        this.test.respondentRequirements.allSegments
      ),
      estimatedIR: Math.round(this.test.estimatedIR * IN_PERCENTS < 1 ? 1 : this.test.estimatedIR * IN_PERCENTS),
      actualIR: Math.round(this.test.actualIR < 1 ? 1 : this.test.actualIR),
      isActualIR:
        this.test.requieredNumberRespondent === this.test.numberRespondents ||
        this.test.numberRespondents > this.test.requieredNumberRespondent,
    };
    this.appliedRespondentOverview.next(data);
  }

  public fetchTestResult(filter?: Record<string, any>): Observable<TestResultModel> {
    const { concepts, segments, genders, age, markets, purchaseFrequencies } = this.form.value;
    const model: TestResultFilterModel = {
      concepts: TestReportUtils.mapIds(concepts, 'isSelected'),
      segments: [...TestReportUtils.mapIds(segments), 'a9122bfd-2664-467b-570b-01d963a7fb19'],
      genderIds: TestReportUtils.mapIds(genders),
      age,
      regions: markets,
      purchaseFrequencyIds: TestReportUtils.mapIds(purchaseFrequencies),
      purchaseFrequencyCategoryId: this.purchaseFrequencyCategoryId,
    };
    return this.testResultService.getTestResultByFilter(filter ?? model, this.test.id).pipe(
      map((data: TestResultModel) => {
        this.canExportPDF$.next(!!Object.keys(data.testConceptResultModels).length);
        this.reportCustomQuestionsService.resetCustomQuestionsData();
        Object.keys(data.testConceptResultModels).forEach(id => {
          const { likedWords, dislikedWords } = data.testConceptResultModels[id].accumulatedLikes;
          this.leaveOnlySymbols(likedWords);
          this.leaveOnlySymbols(dislikedWords);
        });
        return data;
      })
    );
  }

  private leaveOnlySymbols(words: { [word: string]: number }): void {
    Object.keys(words).forEach(key => {
      this.trimWord(key, words[key], key, words);
    });
    if (words['']) {
      delete words[''];
    }
  }

  private trimWord(init: string, initValue: number, word: string, words: { [word: string]: number }): void {
    delete words[init];

    // tslint:disable-next-line:no-shadowed-variable
    const first = word[0];
    const last = word.slice(-1);
    const regExp = new RegExp(/[^A-Za-z0-9]+/);
    if (regExp.test(first)) {
      this.trimWord(init, initValue, word.slice(1), words);
    } else if (regExp.test(last)) {
      this.trimWord(init, initValue, word.slice(0, -1), words);
    } else if (!words[word]) {
      words[word] = initValue;
    }
  }

  private getDataSets(data: TestResultModel): void {
    this.kpiMap
      .asObservable()
      .pipe(
        first(),
        tap((kpi: Map<KPITitle, KPIModel>) => {
          /*Initial dataSets values start*/
          const purchaseIntentUniquenessDataSet: BubbleDataSetModel[] = [];
          const likeabilityTrustworthinessDataSet: BubbleDataSetModel[] = [];
          const purchaseIntentDataSet: BarDataSetModel[] = [];
          const uniquenessDataSet: BarDataSetModel[] = [];
          const consumerInsightDataSet: ConsumerInsightModel[] = [];
          const benefitsDataSet: ConceptBenefitsReasonsModel[] = [];
          const reasonsToBelieveDataSet: ConceptBenefitsReasonsModel[] = [];
          const totalRelevanceDataSet: TotalRelevanceModel[] = [];
          const purchaseFrequenciesDataSet: BarDataSetModel[] = [];
          const consumerInsightRelevanceDataSet: ConceptBenefitsReasonsModel = {
            concept: this.test.concepts[0],
            accumulatedData: [],
          };
          // brand and buisness KPIs
          const kpisWithGroupedBarDataSet: KPIWithGroupedBarDataSet[] = [];
          const purchaseIntentPerSegmentDataSet = [];
          this.test.testKPIs.forEach(testKPI => {
            kpisWithGroupedBarDataSet.push({
              kpi: testKPI.title,
              populationBarDataSet: {
                id: 'a9122bfd-2664-467b-570b-01d963a7fb19',
                label: this.translateService.instant('report.Population'),
                values: [],
              },
              groupedBarDataSet:
                !this.test.respondentRequirements.isCustomSegmentation && !this.test.respondentRequirements.isSegmentation
                  ? []
                  : this.test.respondentRequirements.isCustomSegmentation
                  ? this.test.respondentRequirements.customSegments
                      .filter(item => this.segments.value.map(el => el.value).includes(item.value))
                      .map(segment => {
                        return {
                          id: segment.id,
                          label: segment.value,
                          values: [],
                        };
                      })
                  : this.test.respondentRequirements.segments
                      .filter(segment => segment.id !== 'a9122bfd-2664-467b-570b-01d963a7fb19')
                      .filter(item => this.segments.value.map(el => el.value).includes(item.value))
                      .map(segment => {
                        return {
                          id: segment.id,
                          label: segment.value,
                          values: [],
                        };
                      }),
              countConcepts: this.test.concepts.length,
            });
            purchaseIntentPerSegmentDataSet.push({
              kpi: testKPI.title,
              populationBarDataSet: {
                id: 'a9122bfd-2664-467b-570b-01d963a7fb19',
                label: this.translateService.instant('report.Population'),
                values: [],
              },
              groupedBarDataSet:
                !this.test.respondentRequirements.isCustomSegmentation && !this.test.respondentRequirements.isSegmentation
                  ? []
                  : this.test.respondentRequirements.isCustomSegmentation
                  ? this.test.respondentRequirements.customSegments
                      .filter(item => this.segments.value.map(el => el.value).includes(item.value))
                      .map(segment => {
                        return {
                          id: segment.id,
                          label: segment.value,
                          values: [],
                        };
                      })
                  : this.test.respondentRequirements.segments
                      .filter(segment => segment.id !== 'a9122bfd-2664-467b-570b-01d963a7fb19')
                      .filter(item => this.segments.value.map(el => el.value).includes(item.value))
                      .map(segment => {
                        return {
                          id: segment.id,
                          label: segment.value,
                          values: [],
                        };
                      }),
              countConcepts: this.test.concepts.length,
            });
          });

          const scorePerSegmentDataSet: ConceptScorePerSegmentModel[] = [];
          /*Combine testAssociations and customAssociations */
          const whatDrivesDataSet: GroupedBarDataSet[] = this.test.testAssociations.map(({ id, text }: Association) => ({
            id,
            label: text,
            values: [],
          }));
          this.test.customAssociations.forEach(({ id, value }: ListItem) => {
            whatDrivesDataSet.push({
              id,
              label: value,
              values: [],
            });
          });
          const associationsDataSet: AssociationsPerConceptModel[] = [];
          /*Initial dataSets values end*/
          this.reportCustomQuestionsService.setSegmentAndGenderOptions(this.segmentOptions, this.genderOptions);
          this.test.concepts
            .filter(concept => Object.keys(data.testConceptResultModels).includes(concept.id))
            .forEach((concept: TestConcept, index: number) => {
              /*Preparing intermediate data */
              const { accumulatedKPIs, accumulatedRelevances, accumulatedPurchases } = data.testConceptResultModels[concept.id];
              /*model with ids only, add labels*/

              const label = concept ? concept.conceptName : '';

              const purchaseIntent = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.PurchaseIntent);
              const uniqueness = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.Uniqueness);
              const likeability = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.Likeability);
              const trustworthiness = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.Trustworthiness);
              const purchaseFrequency = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.PurchaseFrequency);
              const currentBrandLikeability = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.CurrentBrandLikeability);
              const relevance = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.Relevance);
              const brandfit = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, KPITitle.Brandfit);

              const accumulatedAssociations = data.testConceptResultModels[concept.id].accumulatedAssocitions.map(
                (item: AccumulatedAssociation) => {
                  let testAssociation: Association | ListItem = this.test.customAssociations.find(
                    ({ id }: ListItem) => id === item.associtionId
                  );
                  if (!testAssociation) {
                    testAssociation = this.test.testAssociations.find(({ id }: Association) => id === item.associtionId);
                    item.label = testAssociation && testAssociation.text;
                  } else {
                    item.label = testAssociation.value;
                  }
                  item.index = Math.round(item.index);
                  return item;
                }
              );

              /** Total relevance */
              if (this.test.testConceptRelevance) {
                const relevanceData = {
                  concept: {
                    id: concept.id,
                    conceptName: concept.conceptName,
                  },
                  dataSet: [
                    {
                      name: 'report.Total relevance KPI',
                      value: Math.round(relevance?.totalPercent) || 0,
                      type: TotalRelevanceType.Total,
                    },
                    {
                      name: 'report.Consumer insight',
                      value: Math.round(accumulatedRelevances[0]?.percent) || 0,
                      type: TotalRelevanceType.ConsumerInsight,
                    },
                  ],
                };
                this.addItemName(concept, data.testConceptResultModels[concept.id].accumulatedBenefits, 'benefits').forEach(elem => {
                  relevanceData.dataSet.push({
                    name: elem.name,
                    value: elem.originalPercent,
                    type: TotalRelevanceType.Benefit,
                  });
                });
                this.addItemName(concept, data.testConceptResultModels[concept.id].accumulatedReaasons, 'reasons').forEach(elem => {
                  relevanceData.dataSet.push({
                    name: elem.name,
                    value: elem.originalPercent,
                    type: TotalRelevanceType.ReasonsToBelieve,
                  });
                });
                totalRelevanceDataSet.push(relevanceData);
              }
              /** Purchase Frequansy */
              if (this.test.purchaseFrequencyEnabled) {
                const purchaseData = {
                  value: 0,
                  label: concept.conceptName,
                  id: concept.id,
                  gridData: [],
                };
                this.allPurchaseFrequencies.forEach(elem => {
                  const answerObj = {
                    label: elem.value,
                    value: accumulatedPurchases.find(item => PurchaseValues[item.value] === elem.id)
                      ? accumulatedPurchases.find(item => PurchaseValues[item.value] === elem.id).percent
                      : 0,
                    index: PurchaseValues[elem.id],
                  };
                  purchaseData.gridData.push(answerObj);
                });
                purchaseFrequenciesDataSet.push(purchaseData);
              }

              /*Mapping dataSets*/
              purchaseIntentUniquenessDataSet.push({
                x: uniqueness ? Math.round(uniqueness.totalPercent) : 0,
                y: purchaseIntent ? Math.round(purchaseIntent.totalPercent) : 0,
                id: concept.id,
                label,
              });

              likeabilityTrustworthinessDataSet.push({
                x: trustworthiness ? Math.round(trustworthiness.totalPercent) : 0,
                y: likeability ? Math.round(likeability.totalPercent) : 0,
                id: concept.id,
                label,
              });

              purchaseIntentDataSet.push({
                value: purchaseIntent ? Math.round(purchaseIntent.totalPercent) : 0,
                id: concept.id,
                label,
                index: index + 1,
              });

              uniquenessDataSet.push({
                value: uniqueness ? Math.round(uniqueness.totalPercent) : 0,
                id: concept.id,
                label,
                index: index + 1,
              });

              consumerInsightDataSet.push({
                concept,
                accumulatedLikes: TestReportUtils.roundLikes(data.testConceptResultModels[concept.id].accumulatedLikes),
              });

              benefitsDataSet.push({
                concept,
                accumulatedData: this.addItemName(concept, data.testConceptResultModels[concept.id].accumulatedBenefits, 'benefits'),
              });

              reasonsToBelieveDataSet.push({
                concept,
                accumulatedData: this.addItemName(concept, data.testConceptResultModels[concept.id].accumulatedReaasons, 'reasons'),
              });

              kpisWithGroupedBarDataSet.forEach(kpiWithGroupedBarDataSet => {
                const accumulatedKPI = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, kpiWithGroupedBarDataSet.kpi);

                kpiWithGroupedBarDataSet.populationBarDataSet.values.push({
                  id: concept.id,
                  label,
                  value: Math.round(accumulatedKPI?.populationPercent),
                });
                kpiWithGroupedBarDataSet.groupedBarDataSet.forEach(segment => {
                  segment.values.push({
                    id: concept.id,
                    label,
                    value: TestReportUtils.getAccumulatedSegmentKPI(accumulatedKPI, segment.id),
                  });
                });
              });

              purchaseIntentPerSegmentDataSet.forEach(
                // tslint:disable-next-line:no-shadowed-variable
                kpiWithGroupedBarDataSet => {
                  const accumulatedKPI = TestReportUtils.getAccumulatedKPI(accumulatedKPIs, kpi, kpiWithGroupedBarDataSet.kpi);
                  kpiWithGroupedBarDataSet.populationBarDataSet.values.push({
                    id: concept.id,
                    label,
                    value: Math.round(accumulatedKPI?.populationPercent),
                  });
                  kpiWithGroupedBarDataSet.groupedBarDataSet.forEach(segment => {
                    segment.values.push({
                      id: concept.id,
                      label,
                      value: TestReportUtils.getAccumulatedSegmentKPI(accumulatedKPI, segment.id),
                    });
                  });
                }
              );

              /** Score per segment */
              scorePerSegmentDataSet.push({
                id: concept.id,
                label,
                segments: [
                  ...TestReportUtils.segmentsByFilter(
                    this.test.respondentRequirements,
                    this.segments.value.map(item => item.id)
                  ),
                ].map(({ id, value }: ListItem) => {
                  return {
                    id,
                    label: value,
                    kpis: TestReportUtils.kpiPerSegment(
                      id,
                      likeability,
                      relevance,
                      trustworthiness,
                      currentBrandLikeability,
                      uniqueness,
                      purchaseFrequency,
                      purchaseIntent,
                      brandfit
                    ),
                  };
                }),
                benchmarks: TestReportUtils.getScorePerSegmentBenchmark(
                  kpi,
                  likeability,
                  relevance,
                  trustworthiness,
                  currentBrandLikeability,
                  uniqueness,
                  purchaseFrequency,
                  purchaseIntent,
                  brandfit
                ),
              });

              whatDrivesDataSet.forEach((association: GroupedBarDataSet) =>
                association.values.push({
                  id: concept.id,
                  label,
                  value: TestReportUtils.getAssociationValue(accumulatedAssociations, association.id),
                  index: TestReportUtils.getAssociationIndex(accumulatedAssociations, association.id),
                  gamma: TestReportUtils.getAssociationGamma(accumulatedAssociations, association.id),
                })
              );

              const associations: AccumulatedAssociation[] = [
                ...this.test.customAssociations.map(({ id, value }) => ({
                  associtionId: id,
                  label: value,
                })),
                ...this.test.testAssociations.map(({ id, text }) => ({
                  associtionId: id,
                  label: text,
                })),
              ];
              associations.forEach(item => {
                const accumulatedAssociation = accumulatedAssociations.find(el => el.associtionId === item.associtionId);
                if (accumulatedAssociation) {
                  item.percent = Math.round(accumulatedAssociation.percent);
                  item.index = Math.round(accumulatedAssociation.index);
                } else {
                  item.percent = 0;
                  item.index = 0;
                }
              });
              associationsDataSet.push({
                id: concept.id,
                label,
                associations: associations.sort((a, b) => {
                  if (a.percent === b.percent) {
                    return b.index - a.index;
                  }
                  return b.percent - a.percent;
                }),
              });
              this.reportCustomQuestionsService.createDataSetItem(concept, data.testConceptResultModels[concept.id]);

              const accumulatedRelevance = accumulatedRelevances[0];
              consumerInsightRelevanceDataSet.accumulatedData.push({
                id: concept.id,
                count: accumulatedRelevance?.count,
                originalPercent: Math.round(accumulatedRelevance?.percent) || 0,
                comparePercent: null,
                name: concept.conceptName,
              });
            });
          /*Results*/
          this.purchaseIntentUniquenessDataSet$.next(purchaseIntentUniquenessDataSet);
          this.likeabilityTrustworthinessDataSet$.next(likeabilityTrustworthinessDataSet);
          this.purchaseIntentDataSet$.next(purchaseIntentDataSet);
          this.uniquenessDataSet$.next(uniquenessDataSet);
          this.consumerInsightDataSet$.next(consumerInsightDataSet);
          this.pdfMoodboardDataSet$.next(consumerInsightDataSet.filter(dataSet => dataSet.concept.moodboard?.items?.length));
          this.benefitsDataSet$.next(benefitsDataSet);
          this.reasonsToBelieveDataSet$.next(reasonsToBelieveDataSet);

          this.kpis$.next(
            kpisWithGroupedBarDataSet.map(
              // tslint:disable-next-line:no-shadowed-variable
              kpiWithGroupedBarDataSet => kpiWithGroupedBarDataSet.kpi
            )
          );
          const resultPurchaseIntentPerSegmentDataSet = [];
          purchaseIntentPerSegmentDataSet.forEach(dataSet => {
            dataSet.groupedBarDataSetPerPage = TestReportUtils.splitArrayOnPages(
              dataSet.groupedBarDataSet,
              dataSet.countConcepts > 5 ? 2 : 5
            );
            if (dataSet.groupedBarDataSet.length > 1) {
              dataSet.groupedBarDataSetPerPage.forEach((group, i) => {
                const resultGroup = {
                  countConcepts: dataSet.countConcepts,
                  groupedBarDataSet: dataSet.groupedBarDataSet,
                  groupedBarDataSetPerPage: group,
                  kpi: dataSet.kpi,
                  populationBarDataSet: dataSet.populationBarDataSet,
                  index: i,
                  total: dataSet.groupedBarDataSetPerPage.length,
                };
                resultPurchaseIntentPerSegmentDataSet.push(resultGroup);
              });
            } else {
              dataSet.groupedBarDataSetPerPage = dataSet.groupedBarDataSetPerPage[0];
              resultPurchaseIntentPerSegmentDataSet.push(dataSet);
            }
          });
          this.purchaseIntentPerSegmentDataSet$.next(resultPurchaseIntentPerSegmentDataSet);
          this.kpisWithGroupedBarDataSet$.next(resultPurchaseIntentPerSegmentDataSet);
          this.reportCustomQuestionsService.setCustomQuestionsDataSet();
          const kpiWithGroupedBarDataSet = kpisWithGroupedBarDataSet.find(
            kpiWithGroupedBarDataSet => kpiWithGroupedBarDataSet.kpi === this.selectedKPI$.value
          );
          kpiWithGroupedBarDataSet.groupedBarDataSetPerPage = TestReportUtils.splitArrayOnPages(
            kpiWithGroupedBarDataSet?.groupedBarDataSet,
            5
          );

          this.selectedKPIWithGroupedBarDataSet$.next(kpiWithGroupedBarDataSet);

          this.scorePerSegmentDataSet$.next(scorePerSegmentDataSet);
          this.whatDrivesDataSet$.next(
            whatDrivesDataSet.sort(
              (a, b) => Math.max(...b.values.map(({ value }) => value)) - Math.max(...a.values.map(({ value }) => value))
            )
          );
          this.associationsDataSet$.next(associationsDataSet);
          consumerInsightRelevanceDataSet.accumulatedData = consumerInsightRelevanceDataSet.accumulatedData.sort(
            (a, b) => b.originalPercent - a.originalPercent
          );
          this.consumerInsightRelevanceDataSet$.next(consumerInsightRelevanceDataSet);
          this.totalRelevanceDataSet$.next(totalRelevanceDataSet);
          this.purchaseFrequenciesDataSet$.next(purchaseFrequenciesDataSet);
          this._setAssociationScorePrecentAndIndexDataSet(data);
        })
      )
      .subscribe();
  }

  private _setAssociationScorePrecentAndIndexDataSet(data): void {
    const whatDrivesDataSet: GroupedBarDataSet[] = this.whatDrivesDataSet$.value;

    const associationScorePrecentDataSet: AssociationsScoreDataModel = {
      dataSource: [],
      displayedColumns: [],
    };
    const associationScoreIndexDataSet: AssociationsScoreDataModel = {
      dataSource: [],
      displayedColumns: [],
    };

    // set TH
    this.test.concepts
      .filter(concept => Object.keys(data.testConceptResultModels).includes(concept.id))
      .forEach(concept => {
        associationScorePrecentDataSet.displayedColumns.push(concept.conceptName);
        associationScoreIndexDataSet.displayedColumns.push(concept.conceptName);
      });

    // set TD

    whatDrivesDataSet.forEach(dataSet => {
      associationScorePrecentDataSet.dataSource.push({
        gamma: dataSet.values[0]?.gamma,
        assotiation: dataSet.label,
        concept1: dataSet.values[0]?.value,
        concept2: dataSet.values[1]?.value,
        concept3: dataSet.values[2]?.value,
        concept4: dataSet.values[3]?.value,
        concept5: dataSet.values[4]?.value,
        concept6: dataSet.values[5]?.value,
        concept7: dataSet.values[6]?.value,
        concept8: dataSet.values[7]?.value,
        concept9: dataSet.values[8]?.value,
        concept10: dataSet.values[9]?.value,
      });

      associationScoreIndexDataSet.dataSource.push({
        gamma: dataSet.values[0]?.gamma,
        assotiation: dataSet.label,
        concept1: dataSet.values[0]?.index,
        concept2: dataSet.values[1]?.index,
        concept3: dataSet.values[2]?.index,
        concept4: dataSet.values[3]?.index,
        concept5: dataSet.values[4]?.index,
        concept6: dataSet.values[5]?.index,
        concept7: dataSet.values[6]?.index,
        concept8: dataSet.values[7]?.index,
        concept9: dataSet.values[8]?.index,
        concept10: dataSet.values[9]?.index,
      });
    });
    associationScorePrecentDataSet.dataSource = associationScorePrecentDataSet.dataSource.sort((a, b) => b.gamma - a.gamma);
    associationScoreIndexDataSet.dataSource = associationScoreIndexDataSet.dataSource.sort((a, b) => b.gamma - a.gamma);
    this.associationScorePrecentDataSet$.next(associationScorePrecentDataSet);
    this.associationScoreIndexDataSet$.next(associationScoreIndexDataSet);
  }

  private addItemName(
    concept: TestConcept,
    accumulatedData: AccumulatedBenefits[] | AccumulatedReasons[],
    mapBy: string
  ): AccumulatedBenefits[] {
    return accumulatedData.map(item => {
      const entity = concept[mapBy];
      const current = entity.find(benefit => benefit.id === item.id);
      item.name = current.value;
      item.originalPercent = Math.round(item.originalPercent);
      return item;
    });
  }

  private resetData(): void {
    while (this.concepts.length > 0) {
      this.concepts.removeAt(0);
    }
  }

  private getPurchaseFrequencyCategoryId(): string {
    return this.test.respondentRequirements.involvementId === NO_ORDER_ID
      ? this.test.respondentRequirements.involvementCategoryId
      : this.test.respondentRequirements.involvementId;
  }

  private getTestSource(test: Test): void {
    const testSource = `${this.appStateService.currentCompany.getValue().companyName}, ${test.testName}, ${formatDate(
      new Date(test.startDate),
      'y-MM-dd',
      'en-US'
    )} - ${formatDate(new Date(test.endDate), 'y-MM-dd', 'en-US')}, ${test.respondentRequirements.countries[0].value}, ${
      test.numberRespondents
    }`;
    this.testSource$.next(testSource);
  }
}
