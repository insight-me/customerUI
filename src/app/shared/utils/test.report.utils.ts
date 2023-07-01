import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CloudData } from 'angular-tag-cloud-module';
import { forIn, mapValues } from 'lodash';
import { COLORS2, COLORS3, KPI_NAME, OVERALL_SCORE_BUBBLE_CHART_COLORS } from 'src/assets/consts/consts';
import { LOW_NUMBER_OF_RESPONDENTS } from '../../../assets/consts/report.const';
import { TimeInternal } from '../enums/period.enum';
import { AdditionalQuestionsModel, QuestionFeedback } from '../models/bic.test.report/additional.questions.model';
import { BarDataSetModel } from '../models/bic.test.report/bar.data.set.model';
import { BenchmarkModel, ConceptBenchmark, SegmentKpisValues } from '../models/bic.test.report/concept.score.per.segment.model';
import { KPIModel, KPITitle } from '../models/bic.test.report/KPIModel';
import { SummaryDatasetModel } from '../models/bic.test.report/summary.dataset.model';
import {
  AccumulatedAssociation,
  AccumulatedKPI,
  AccumulatedLikes,
  AccumulatedSegmentKPI
} from '../models/bic.test.report/test.concept.result.model';
import { ColumnsCustomQuestions, CustomQuestions } from '../models/bic.test/bic.custom.questions.model';
import { BTBrand } from '../models/bt-test.model';
import { BrandFunnelDatasetModelItem } from '../models/bt.test.report/brand.funnel.dataset.model';
import { BtBrandsKpiLineChartDataset, KpiSegmentDataSet } from '../models/bt.test.report/bt.brands.kpi.line.chart.dataset.model';
import {
  Association,
  BrandResultModels,
  BtTestResultModel,
  IntervalResultModelsCustomQuestions,
  IntervalTotalItem,
  IntervalTotals,
  ITotalBrandResultModels,
  Recomendations,
  SegmentAccumulatedAssociation,
  SegmentAccumulatedModel
} from '../models/bt.test.report/bt.test.result.model';
import { BtBrandsLineChartDataSet } from '../models/bt.test.report/btBrandsLineChartDataSet';
import { LineChartDataSet, SeriesModel } from '../models/bt.test.report/line.chart.dataset';
import { RespondentOptions, Segment } from '../models/test-creation.model';
import { AdditionalQuestionListItem, Countries, Country, ListItem, RespondentRequirements, Subdivision } from '../models/test.model';
import { IBrandFunnelDataset, INewBrandFunnelDatasetItem } from './../models/bt.test.report/brand.funnel.dataset.model';

export class TestReportUtils {
  public static filterStartDate: Date;
  public static marketsOptionsHtml(
    countries: Country[],
    subdivisions: Subdivision[],
    allCountries: Countries[],
    translateService: TranslateService
  ): string {
    let result = '';
    countries.forEach(country => {
      const subdivisionsLabels: string[] = subdivisions.filter(({ countryId }) => countryId === country.id).map(({ value }) => value);
      result += `<p>${country.value}: ${subdivisionsLabels.length === allCountries.find(item => item.id === country.id).subdivisions.length
        ? translateService.instant('report.All regions')
        : subdivisionsLabels.join(', ')
        }</p>`;
    });
    return result;
  }

  public static marketsOptionsByFormValueHtml(
    countries: Country[],
    subdivisions: Subdivision[],
    markets: string[],
    allCountries: Countries[],
    translateService: TranslateService
  ): string {
    let result = '';
    countries.forEach(country => {
      const selectedSubdivisions = subdivisions.filter(({ countryId, id }) => countryId === country.id && markets.includes(id));
      if (selectedSubdivisions.length) {
        result += `<p>${country.value}: ${selectedSubdivisions.length === allCountries.find(item => item.id === country.id).subdivisions.length
          ? translateService.instant('report.All regions')
          : selectedSubdivisions.map(({ value }) => value).join(', ')
          }</p>`;
      }
    });
    return result;
  }

  public static setRequiredValidator(control: FormControl): void {
    control.setValidators(Validators.required);
    control.updateValueAndValidity();
  }

  public static mapIds(arr: any[], filterBy?: string): string[] {
    if (filterBy) {
      return arr.filter(option => option[filterBy]).map(({ id }) => id);
    } else {
      return arr.map(({ id }) => id);
    }
  }

  public static arrayValuesToString(arr: ListItem[]): string {
    return arr.map(({ value }: ListItem) => value).join(', ');
  }

  public static getAccumulatedKPI(accumulatedKPIs: AccumulatedKPI[], kpi: Map<KPITitle, KPIModel>, title: KPITitle): AccumulatedKPI {
    if (!accumulatedKPIs) {
      return null;
    }
    if (!kpi.get(title)) {
      return null;
    }
    return accumulatedKPIs.find(({ kpiId }) => kpiId === kpi.get(title).id);
  }

  public static randomInteger(min: number, max: number): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  public static getColor(index: number, secondColorsSet: boolean = false): string {
    const set = secondColorsSet ? COLORS2 : OVERALL_SCORE_BUBBLE_CHART_COLORS;
    const maxIndex = set.length;
    const multiply = Math.floor(index / maxIndex);
    return set[index - maxIndex * multiply];
  }

  public static getLineChartColor(index: number): string {
    const maxIndex = COLORS3.length;
    const multiply = Math.floor(index / maxIndex);
    return COLORS3[index - maxIndex * multiply];
  }

  public static getAccumulatedSegmentKPI(accumulatedKPI: AccumulatedKPI, id: string): number {
    if (!accumulatedKPI) {
      return 0;
    }
    const accumulatedSegmentKPI = accumulatedKPI.accumulatedSegmentKPIs.find(({ segmentId }: AccumulatedSegmentKPI) => segmentId === id);
    return accumulatedSegmentKPI ? Math.round(accumulatedSegmentKPI.percent) : 0;
  }

  private static getBenchmarkModel(kpiTitle: KPITitle, kpi: Map<KPITitle, KPIModel>, accumulatedKPI: AccumulatedKPI): BenchmarkModel {
    return {
      benchmark: kpi.get(kpiTitle) ? Math.round(kpi.get(kpiTitle).benchmarkValue) : 0,
      total: accumulatedKPI ? Math.round(accumulatedKPI.populationPercent) : 0,
    };
  }

  public static getScorePerSegmentBenchmark(
    kpi: Map<KPITitle, KPIModel>,
    likeability: AccumulatedKPI,
    relevance: AccumulatedKPI,
    trustworthiness: AccumulatedKPI,
    currentBrandLikeability: AccumulatedKPI,
    uniqueness: AccumulatedKPI,
    purchaseFrequency: AccumulatedKPI,
    purchaseIntent: AccumulatedKPI,
    brandFit: AccumulatedKPI
  ): ConceptBenchmark {
    return {
      [KPITitle.Likeability]: TestReportUtils.getBenchmarkModel(KPITitle.Likeability, kpi, likeability),
      [KPITitle.Relevance]: TestReportUtils.getBenchmarkModel(KPITitle.Relevance, kpi, relevance),
      [KPITitle.Trustworthiness]: TestReportUtils.getBenchmarkModel(KPITitle.Trustworthiness, kpi, trustworthiness),
      [KPITitle.CurrentBrandLikeability]: TestReportUtils.getBenchmarkModel(KPITitle.CurrentBrandLikeability, kpi, currentBrandLikeability),
      [KPITitle.Uniqueness]: TestReportUtils.getBenchmarkModel(KPITitle.Uniqueness, kpi, uniqueness),
      [KPITitle.PurchaseFrequency]: TestReportUtils.getBenchmarkModel(KPITitle.PurchaseFrequency, kpi, purchaseFrequency),
      [KPITitle.PurchaseIntent]: TestReportUtils.getBenchmarkModel(KPITitle.PurchaseIntent, kpi, purchaseIntent),
      [KPITitle.Brandfit]: TestReportUtils.getBenchmarkModel(KPITitle.Brandfit, kpi, brandFit),
    };
  }

  public static kpiPerSegment(
    id: string,
    likeability: AccumulatedKPI,
    relevance: AccumulatedKPI,
    trustworthiness: AccumulatedKPI,
    currentBrandLikeability: AccumulatedKPI,
    uniqueness: AccumulatedKPI,
    purchaseFrequency: AccumulatedKPI,
    purchaseIntent: AccumulatedKPI,
    brandfit: AccumulatedKPI
  ): SegmentKpisValues {
    return {
      [KPITitle.Likeability]: TestReportUtils.getAccumulatedSegmentKPI(likeability, id),
      [KPITitle.Relevance]: TestReportUtils.getAccumulatedSegmentKPI(relevance, id),
      [KPITitle.Trustworthiness]: TestReportUtils.getAccumulatedSegmentKPI(trustworthiness, id),
      [KPITitle.CurrentBrandLikeability]: TestReportUtils.getAccumulatedSegmentKPI(currentBrandLikeability, id),
      [KPITitle.Uniqueness]: TestReportUtils.getAccumulatedSegmentKPI(uniqueness, id),
      [KPITitle.PurchaseFrequency]: TestReportUtils.getAccumulatedSegmentKPI(purchaseFrequency, id),
      [KPITitle.PurchaseIntent]: TestReportUtils.getAccumulatedSegmentKPI(purchaseIntent, id),
      [KPITitle.Brandfit]: TestReportUtils.getAccumulatedSegmentKPI(brandfit, id),
    };
  }

  public static getAssociationValue(accumulatedAssociations: AccumulatedAssociation[], id: string): number {
    const association = accumulatedAssociations?.find(({ associtionId }: AccumulatedAssociation) => associtionId === id);
    return association ? Math.round(association.percent) : 0;
  }

  public static getAssociationIndex(accumulatedAssociations: AccumulatedAssociation[], id: string): number {
    const association = accumulatedAssociations?.find(({ associtionId }: AccumulatedAssociation) => associtionId === id);
    return association ? Math.round(association.index) : 0;
  }

  public static getAssociationGamma(accumulatedAssociations: AccumulatedAssociation[], id: string): number {
    const association = accumulatedAssociations?.find(({ associtionId }: AccumulatedAssociation) => associtionId === id);
    return association ? association.gamma : 0;
  }

  public static divideIntoColumnsPDF(items: any[], target: any[]): void {
    switch (items.length) {
      case 0:
        break;
      case 1:
        target.push(items);
        break;
      case 2:
        target.push(items.slice(0, 1));
        target.push(items.slice(1, 2));
        break;
      case 3:
        target.push(items.slice(0, 1));
        target.push(items.slice(1, 2));
        target.push(items.slice(2, 3));
        break;
      case 4:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 3));
        target.push(items.slice(3, 4));
        break;
      case 5:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 5));
        break;
      case 6:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 6));
        break;
      case 7:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 6));
        target.push(items.slice(6, 7));
        break;
      case 8:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 6));
        target.push(items.slice(6, 8));
        break;
      case 9:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 6));
        target.push(items.slice(6, 8));
        target.push(items.slice(8, 9));
        break;
    }
  }

  public static divideIntoColumns(items: any[], target: any[]): void {
    switch (items.length) {
      case 0:
        break;
      case 1:
        target.push(items);
        break;
      case 2:
        target.push(items.slice(0, 1));
        target.push(items.slice(1, 2));
        break;
      case 3:
        target.push(items.slice(0, 1));
        target.push(items.slice(1, 2));
        target.push(items.slice(2, 3));
        break;
      case 4:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 3));
        target.push(items.slice(3, 4));
        break;
      case 5:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 5));
        break;
      case 6:
        target.push(items.slice(0, 2));
        target.push(items.slice(2, 4));
        target.push(items.slice(4, 6));
        break;
      case 7:
        target.push(items.slice(0, 3));
        target.push(items.slice(3, 5));
        target.push(items.slice(5, 7));
        break;
      case 8:
        target.push(items.slice(0, 3));
        target.push(items.slice(3, 6));
        target.push(items.slice(6, 8));
        break;
      case 9:
        target.push(items.slice(0, 3));
        target.push(items.slice(3, 6));
        target.push(items.slice(6, 9));
        break;
    }
  }

  public static summaryDataSet({ likedWords, dislikedWords }: AccumulatedLikes): SummaryDatasetModel[] {
    const res: SummaryDatasetModel[] = Object.keys(likedWords)
      .map((word: string) => ({
        word,
        likes: likedWords[word],
        dislikes: 0,
      }))
      .sort((a, b) => b.likes - a.likes);

    Object.keys(dislikedWords)
      .map((word: string) => ({
        word,
        likes: 0,
        dislikes: dislikedWords[word],
      }))
      .sort((a, b) => b.dislikes - a.dislikes)
      .forEach((dataset: SummaryDatasetModel) => {
        const existing = res.find(el => el.word === dataset.word);
        if (existing) {
          existing.dislikes = dataset.dislikes;
        } else {
          res.push(dataset);
        }
      });
    return res;
  }

  public static angularTagCloudData({ likedWords, dislikedWords }: AccumulatedLikes): CloudData[] {
    return Object.keys({ ...likedWords, ...dislikedWords }).map((word: string, index: number) => ({
      text: word,
      weight: (likedWords[word] || 0) + (dislikedWords[word] || 0),
      color: TestReportUtils.getColor(index),
    }));
  }

  public static splitArrayOnPages(array: any[], itemsPerPage: number): any[][] {
    const pages = Math.ceil(array?.length / itemsPerPage);
    const res = [];
    for (let i = 0; i < pages; i++) {
      const data = array.slice(itemsPerPage * i, itemsPerPage * (i + 1));
      res.push(data);
    }
    return res;
  }

  public static divideBrands(brands: BTBrand[]): {
    ownBrands: ListItem[];
    competitorsBrands: BTBrand[];
  } {
    const ownBrands = [];
    const competitorsBrands = [];
    brands.forEach((brand: BTBrand) => {
      brand.isOwn ? ownBrands.push(brand) : competitorsBrands.push(brand);
    });
    ownBrands.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    competitorsBrands.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    return {
      ownBrands,
      competitorsBrands,
    };
  }

  public static getIntervals(data: BrandResultModels[]): number[] {
    const intervals = new Set<number>();
    const intervalArr = data.map(item => item.intervalIndex);
    const firstEl = intervalArr[0];
    data.forEach(item => intervals.add(item.intervalIndex));

    if (data.length > 2 && intervalArr.every(interval => firstEl === interval)) {
      return [intervalArr[0], intervalArr[1]];
    }

    return data.length === 2 ? intervalArr : Array.from(intervals).slice(-2);
  }

  public static getAbsoluteDate(periodValue: TimeInternal, date: Date): number {
    switch (periodValue) {
      case TimeInternal.Weekly:
      default:
        return this.getAbsWeek(date);
      case TimeInternal.Monthly:
        return TestReportUtils.getAbsMonth(date);
      case TimeInternal.Quarterly:
        return TestReportUtils.getAbsQuarter(date);
      case TimeInternal.Yearly:
        return TestReportUtils.getAbsYear(date);
    }
  }

  public static getAbsWeek(date: Date): number {
    const year = date.getFullYear();
    const jan1 = new Date(year, 0, 1);
    const dayOfWeekJan1 = jan1.getDay();
    const daysInYear = (new Date(year + 1, 0, 1).getTime() - jan1.getTime()) / (1000 * 60 * 60 * 24);
    const daysBeforeFirstThursday = (4 - ((dayOfWeekJan1 + 3) % 7)) % 7;
    const firstThursday = new Date(year, 0, 1 + daysBeforeFirstThursday);
    const daysBeforeFirstWeek = (firstThursday.getTime() - jan1.getTime()) / (1000 * 60 * 60 * 24);
    const weekNum = Math.floor((date.getTime() - firstThursday.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    let weeksInYear = Math.floor((daysInYear - daysBeforeFirstWeek) / 7) + 1;
    if (weeksInYear === 52 && daysBeforeFirstThursday > 3) {
      weeksInYear = 53;
    }
    return year * weeksInYear + weekNum;
  }

  public static getAbsQuarter(date: Date): number {
    const year = date.getFullYear() * 4;
    const month = Math.floor(date.getMonth() / 3);
    return year + month;
  }

  public static getAbsMonth(date: Date): number {
    const year = date.getFullYear() * 12;
    const month = date.getMonth();
    return year + month;
  }

  public static getAbsYear(date: Date): number {
    return date.getFullYear();
  }

  public static getDateFromQuarter(quarter: number): Date {
    const year = Math.floor(quarter / 4);
    const month = (quarter - year * 4) * 3;
    return new Date(year, month, 1);
  }

  public static getDateFromWeek(index: number): Date {
    const year = Math.floor(index / 53);
    const weekOfYear = index % 53;
    const date = new Date(year, 0, 1);
    date.setDate(date.getDate() + weekOfYear * 7);
    return date;
  }

  public static getDateFromMonth(index: number): Date {
    const year = Math.floor(index / 12);
    const month = index % 12;
    const date = index % 12 === 0 ? new Date(year - 1, month, 1) : new Date(year, month, 1);
    return date;
  }

  public static brandPerformanceOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    kpi: Map<KPITitle, KPIModel>,
    segments: ListItem[]
  ): BtBrandsLineChartDataSet {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    const dataset: LineChartDataSet[] = [];

    kpi.forEach((value: KPIModel, key: KPITitle) => {
      dataset.push({
        name: KPI_NAME[key],
        id: value.id,
        series: TestReportUtils.brandPerformanceOverTimeMapper(key, results),
        segments: segments?.map(segment => TestReportUtils.brandPerformanceOverTimeSegmentsMapper(key, results, segment.id)),
        total: TestReportUtils.brandPerformanceOverTimeMapper(key, results),
      });
    });

    return {
      brand,
      dataset,
    };
  }

  public static awarenessPerformanceOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    kpi: Map<KPITitle, KPIModel>,
    segments: ListItem[]
  ): BtBrandsLineChartDataSet {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    const dataset: LineChartDataSet[] = [];
    kpi.forEach((value: KPIModel, key: KPITitle) => {
      dataset.push({
        name: KPI_NAME[key],
        id: value.id,
        series: TestReportUtils.brandPerformanceOverTimeMapper(key, results),
        segments: segments?.map(segment => TestReportUtils.brandPerformanceOverTimeSegmentsMapper(key, results, segment.id)),
        total: TestReportUtils.brandPerformanceOverTimeMapper(key, results),
      });
    });
    dataset.unshift({
      name: 'report.Ad awareness',
      id: 'adAwareness',
      series: TestReportUtils.adAwarenessTimeMapper(results),
      segments: segments?.map(segment => TestReportUtils.adAwarenessSegmentsMapper(results, segment.id)),
      total: TestReportUtils.adAwarenessTimeMapper(results),
    });

    return {
      brand,
      dataset,
    };
  }

  public static netPromoterScoreOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    segments: ListItem[]
  ): BtBrandsLineChartDataSet {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    const groups = [
      { name: 'Detractors', value: 'detractorsPercent' },
      { name: 'Passives', value: 'passivesPercent' },
      { name: 'Promoters', value: 'promotersPercent' },
    ];

    const dataset: LineChartDataSet[] = [];
    groups.forEach(group =>
      dataset.push({
        name: group.name,
        id: group.value,
        series: TestReportUtils.netPromoterScoreOverTimeMapper(group, results, null),
        segments: segments?.map(segment => TestReportUtils.netPromoterScoreOverTimeSegmentsMapper(group, results, segment.id)),
        total: TestReportUtils.netPromoterScoreOverTimeMapper(group, results, null),
      })
    );
    return {
      brand,
      dataset,
    };
  }

  public static adAwarenessModels(brand: BTBrand, brandResultModels: BrandResultModels[], segments: ListItem[]): LineChartDataSet {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    return {
      name: brand.name,
      isOwn: brand.isOwn,
      id: brand.id,
      color: brand.color,
      series: TestReportUtils.adAwarenessTimeMapper(results),
      segments: segments?.map(segment => TestReportUtils.adAwarenessSegmentsMapper(results, segment.id)),
    };
  }

  public static netPromoterScoreMainModels(brand: BTBrand, recommendations: Recomendations[], segments: ListItem[]): LineChartDataSet {
    const results = recommendations.find(item => item.brandId === brand.id) || {
      brandId: brand.id,
      detractorsPercent: 0,
      nps: 0,
      passivesPercent: 0,
      promotersPercent: 0,
      total: 0,
      segmentRecomendations: [],
    };
    if (results) {
      const { nps, detractorsPercent, total, passivesPercent, promotersPercent } = results;
      return {
        name: brand.name,
        isOwn: brand.isOwn,
        id: brand.id,
        color: brand.color,
        nps: nps || 0,
        series: [
          { name: 'Detractors', value: detractorsPercent || 0, nps: nps || 0, totals: total },
          {
            name: 'Passives',
            value: passivesPercent || 0,
            nps: nps || 0,
            totals: total,
          },
          {
            name: 'Promoters',
            value: promotersPercent || 0,
            nps: nps || 0,
            totals: total,
          },
        ],
        segments: segments?.map(segment => TestReportUtils.netPromoterScoreSegmentsMapper(results, segment.id)),
      };
    }
  }

  public static associationsOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    associations: ListItem[],
    segments: ListItem[]
  ): BtBrandsLineChartDataSet {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    const dataset: LineChartDataSet[] = [];
    associations.forEach(({ id, value }: ListItem) => {
      dataset.push({
        name: value,
        id,
        series: TestReportUtils.associationsOverTimeMapper(id, results),
        segments: segments?.map(segment => TestReportUtils.associationsOverTimeSegmentsMapper(id, results, segment.id)),
      });
    });
    return {
      brand,
      dataset,
    };
  }

  private static associationsOverTimeMapper(id: string, brandResultModels: BrandResultModels[]): SeriesModel[] {
    return brandResultModels.map(model => {
      const association = model.associtians?.find(({ associtionId }: Association) => associtionId === id);
      return {
        value: association ? Math.round(association.percent) : 0,
        name: TestReportUtils._chooseIntervalMode(model),
      };
    });
  }

  private static associationsOverTimeSegmentsMapper(id: string, brandResultModels: BrandResultModels[], segmentId): SeriesModel[] {
    return brandResultModels.map(model => {
      const association = model.segments
        ?.find(segment => segment.segmentId === segmentId)
        ?.segmentAccumulatedAccocition?.find(assoc => assoc.associtionId === id);
      return {
        value: association ? Math.round(association.percent) : 0,
        name: TestReportUtils._chooseIntervalMode(model),
        segment: segmentId,
      };
    });
  }

  public static competitorsPerformanceOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    kpi: KPITitle,
    segments: ListItem[]
  ): LineChartDataSet {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);

    return {
      name: brand.name,
      isOwn: brand.isOwn,
      id: brand.id,
      color: brand.color,
      series: TestReportUtils.competitorsPerformanceOverTimeMapper(kpi, results),
      segments: segments?.map(segment => TestReportUtils.brandPerformanceOverTimeSegmentsMapper(kpi, results, segment.id)),
    };
  }

  public static healthInTargetGroupsModels(segment: ListItem, brandResultModel: BrandResultModels, kpi: KPITitle): BarDataSetModel {
    const segmentReport =
      brandResultModel &&
      brandResultModel.segments &&
      brandResultModel?.segments?.find(({ segmentId }: SegmentAccumulatedModel) => segmentId === segment.id);
    const value = segmentReport ? Math.round(segmentReport[kpi]) : 0;

    return {
      id: segment.id,
      label: segment.value,
      value,
    };
  }

  public static associationsInTargetGroupsModels(
    segment: ListItem,
    brandResultModel: ITotalBrandResultModels,
    associationId: string,
    isTotal: boolean = false
  ): BarDataSetModel {
    if (isTotal) {
      const association =
        brandResultModel &&
        brandResultModel.associtians &&
        brandResultModel.associtians.find(({ associtionId }: Association) => associtionId === associationId);
      const value = association ? Math.round(association.percent) : 0;
      return {
        id: 'population',
        label: 'Population',
        value,
      };
    } else {
      const segmentReport =
        brandResultModel &&
        brandResultModel.segments &&
        brandResultModel?.segments?.find(({ segmentId }: SegmentAccumulatedModel) => segmentId === segment.id);
      const association =
        segmentReport &&
        segmentReport.segmentAccumulatedAccocition?.find(
          ({ associtionId }: SegmentAccumulatedAssociation) => associtionId === associationId
        );
      const value = association ? Math.round(association.percent) : 0;
      return {
        id: segment.id,
        label: segment.value,
        value,
      };
    }
  }

  public static brandAndAssociationsOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    associationId: string,
    segments: ListItem[]
  ): LineChartDataSet {
    const result = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    return {
      name: brand.name,
      id: brand.id,
      color: brand.color,
      series: TestReportUtils.brandAndAssociationsOverTimeMapper(associationId, result),
      segments: segments?.map(segment => TestReportUtils.brandAndAssociationsOverTimeSegmentsMapper(associationId, result, segment.id)),
    };
  }

  private static brandAndAssociationsOverTimeSegmentsMapper(
    id: string,
    brandResultModels: BrandResultModels[],
    segmentId: string
  ): SeriesModel[] {
    return brandResultModels.map(model => {
      const association = model.segments
        ?.find(segment => segment.segmentId === segmentId)
        ?.segmentAccumulatedAccocition?.find(assoc => assoc.associtionId === id);
      return {
        value: association ? Math.round(association.percent) : 0,
        name: TestReportUtils._chooseIntervalMode(model),
        segment: segmentId,
      };
    });
  }

  public static associationsComparedToCompetitorsModels(
    brand: BTBrand,
    totalBrandResultModels: ITotalBrandResultModels[],
    associationId: string
  ) {
    const currentBrandResultModel = totalBrandResultModels.find(({ brandId }) => brandId === brand.id);

    const association =
      currentBrandResultModel &&
      currentBrandResultModel.associtians &&
      currentBrandResultModel.associtians.find(({ associtionId }) => associtionId === associationId);

    const value = association ? Math.round(association.percent) : 0;
    return {
      id: brand.id,
      label: brand.name,
      value,
      isOwn: brand.isOwn,
    };
  }

  private static _chooseIntervalMode(brandResult: BrandResultModels): string {
    switch (brandResult.timeInternal) {
      case TimeInternal.Weekly:
      default:
        return this._weekNumber(brandResult);
      case TimeInternal.Monthly:
        return this._monthName(brandResult);
      case TimeInternal.Quarterly:
        return this.seriesName(brandResult);
      case TimeInternal.Yearly:
        return this._yearName(brandResult).toString();
    }
  }

  private static brandAndAssociationsOverTimeMapper(id: string, brandResultModels: BrandResultModels[]): SeriesModel[] {
    return brandResultModels.map(model => {
      const association = model.associtians?.find(({ associtionId }: Association) => associtionId === id);
      return {
        value: association ? Math.round(association.percent) : 0,
        name: TestReportUtils._chooseIntervalMode(model),
      };
    });
  }

  public static associationsComparedToCompetitorsSegmentsModels(
    brand: BTBrand,
    brandResultModels: ITotalBrandResultModels[],
    associationId: string,
    segmentId: string
  ): BarDataSetModel {
    const currentQuarterBrandResultModel = brandResultModels
      .find(({ brandId }) => brandId === brand.id)
      .segments.find(segment => segment.segmentId === segmentId);
    const association =
      currentQuarterBrandResultModel &&
      currentQuarterBrandResultModel.segmentAccumulatedAccocition &&
      currentQuarterBrandResultModel.segmentAccumulatedAccocition.find(({ associtionId }) => associtionId === associationId);
    const value = association ? Math.round(association.percent) : 0;
    return {
      id: brand.id,
      label: brand.name,
      value,
      isOwn: brand.isOwn,
    };
  }

  private static competitorsPerformanceOverTimeMapper(kpi: KPITitle, brandResultModels: BrandResultModels[]): SeriesModel[] {
    return brandResultModels.map((model: BrandResultModels) => {
      return {
        value: Math.round(model[kpi]),
        name: TestReportUtils._chooseIntervalMode(model),
      };
    });
  }

  private static adAwarenessTimeMapper(brandResultModels: BrandResultModels[]): SeriesModel[] {
    return brandResultModels.map((model: BrandResultModels) => {
      return {
        value: (model && model.comercialRecognition && Math.round(model.comercialRecognition)) || 0,
        name: TestReportUtils._chooseIntervalMode(model),
      };
    });
  }

  public static targetGroupPerformanceOverTimeModels(
    brand: BTBrand,
    brandResultModels: BrandResultModels[],
    segments: ListItem[],
    kpi: Map<KPITitle, KPIModel>
  ): BtBrandsKpiLineChartDataset {
    const results = TestReportUtils.brandResultModelsByBrand(brandResultModels, brand);
    const kpis: KpiSegmentDataSet[] = [];
    kpi.forEach((value: KPIModel, key: KPITitle) => {
      kpis.push({
        kpi: key,
        id: value.id,
        /* 1639 have to add Total as one more segment */
        dataset: [{ id: 'population', value: 'Population' }, ...segments].map(({ value, id }: ListItem) => {
          return {
            name: value,
            id,
            series: TestReportUtils.targetGroupPerformanceOverTimeMapper(id, results, key),
          };
        }),
      });
    });

    return {
      brand,
      kpis,
    };
  }

  private static targetGroupPerformanceOverTimeMapper(id: string, brandResultModels: BrandResultModels[], kpi: KPITitle): SeriesModel[] {
    return brandResultModels.map((model: BrandResultModels) => {
      const segment = model.segments?.find(({ segmentId }: SegmentAccumulatedModel) => segmentId === id);
      let value = segment ? Math.round(segment[kpi]) : 0;
      if (id === 'population') {
        value = Math.round(model[kpi]) || 0;
      }
      return {
        value,
        name: TestReportUtils._chooseIntervalMode(model),
      };
    });
  }

  private static brandPerformanceOverTimeMapper(title: KPITitle, brandResultModels: BrandResultModels[]): SeriesModel[] {
    return brandResultModels.map(model => {
      return {
        value: Math.round(model[title]),
        name: TestReportUtils._chooseIntervalMode(model),
      };
    });
  }

  private static brandPerformanceOverTimeSegmentsMapper(
    title: KPITitle,
    brandResultModels: BrandResultModels[],
    segmentId: string
  ): SeriesModel[] {
    return brandResultModels.map(model => {
      return {
        value: Math.round(model.segments?.find(item => item.segmentId === segmentId)?.[title] || 0),
        name: TestReportUtils._chooseIntervalMode(model),
        segment: segmentId,
      };
    });
  }

  private static adAwarenessSegmentsMapper(brandResultModels: BrandResultModels[], segmentId: string): SeriesModel[] {
    return brandResultModels.map(model => {
      return {
        value: Math.round(model.segments?.find(item => item.segmentId === segmentId)?.comercialRecognition || 0),
        name: TestReportUtils._chooseIntervalMode(model),
        segment: segmentId,
      };
    });
  }

  private static netPromoterScoreSegmentsMapper(results: Recomendations, segmentId: string): SeriesModel[] {
    const segmentRecommendations = results?.segmentRecomendations.find(item => item.segmentId === segmentId);

    const groups = [
      { name: 'Detractors', value: 'detractorsPercent' },
      { name: 'Passives', value: 'passivesPercent' },
      { name: 'Promoters', value: 'promotersPercent' },
    ];

    return groups.map(group => ({
      name: group.name,
      value: segmentRecommendations?.[group.value] || 0,
      segment: segmentId,
      nps: Math.round(segmentRecommendations?.nps) || 0,
      totals: segmentRecommendations?.total,
    }));
  }

  private static netPromoterScoreOverTimeMapper(key: any, results: any, segmentId: string): SeriesModel[] {
    const resultArr = [];
    results.forEach(res => {
      resultArr.push({
        name: TestReportUtils._chooseIntervalMode(res),
        value: (res.recomendations && res.recomendations[key.value]) || 0,
        segment: segmentId || null,
        nps: res.recomendations?.nps || 0,
        totals: res.recomendations?.total,
      });
    });
    return resultArr;
  }

  private static netPromoterScoreOverTimeSegmentsMapper(key: any, results: any, segmentId: string): SeriesModel[] {
    const resultArr = [];
    results.forEach(res => {
      const segmentResFromServer = res.segments.find(item => item.segmentId === segmentId)?.recomendations;
      const segmentRes = (segmentResFromServer && segmentResFromServer[0]) || {
        brandId: res.brandId,
        detractorsPercent: 0,
        nps: 0,
        passivesPercent: 0,
        promotersPercent: 0,
        segmentId,
        total: 0,
      };
      resultArr.push({
        name: TestReportUtils._chooseIntervalMode(res),
        value: segmentRes[key.value],
        segment: segmentId,
        nps: segmentRes.nps,
        totals: segmentRes.total,
      });
    });
    return resultArr;
  }

  public static brandFunnelModels(brand: BTBrand, brandResultModel: ITotalBrandResultModels, segments: ListItem[]): IBrandFunnelDataset {
    const dataset: INewBrandFunnelDatasetItem[] = [];
    dataset.push(this.brandFunnelDataset(brandResultModel, null));

    if (segments) {
      segments.forEach(segment => {
        const matchingSegment = brandResultModel.segments.find(item => segment.id === item.segmentId);
        dataset.push(this.brandFunnelDataset(matchingSegment as any, segment.id));
      });
    }
    return {
      brand,
      dataset,
    };
  }
  /**
   * Transforms the brand model into a new brand funnel dataset item. The calculations are taken from the excel provided by Melina
   * @param {ITotalBrandResultModels} brandModel - The brand model to be transformed.
   * @param {string} segmentId - The segment ID.
   * @returns {INewBrandFunnelDatasetItem} The transformed brand funnel dataset item.
   */

  private static brandFunnelDataset(brandModel: ITotalBrandResultModels, segmentId: string): INewBrandFunnelDatasetItem {
    const aidedAwarenessToConsiderationDivision = brandModel ? (brandModel.considerations / brandModel.aidedAwareness) * 100 : 0;
    const considerationToPreferenceDivision = brandModel ? (brandModel.preferences / brandModel.considerations) * 100 : 0;
    const aidedAwarenessToPenetrationDivision = brandModel ? (brandModel.penetrations / brandModel.aidedAwareness) * 100 : 0;

    const aidedAwarenessToConsideration = Number.isFinite(aidedAwarenessToConsiderationDivision) ? aidedAwarenessToConsiderationDivision : 0;
    const aidedAwarenessToPenetration = Number.isFinite(aidedAwarenessToPenetrationDivision) ? aidedAwarenessToPenetrationDivision : 0;
    const considerationToPreference = Number.isFinite(considerationToPreferenceDivision) ? considerationToPreferenceDivision : 0;

    return {
      aidedAwareness: Math.floor(brandModel?.aidedAwareness ?? 0),
      accumulatedConsiderations: brandModel?.accumulatedConsiderations ?? [],
      considerations: Math.floor(brandModel?.considerations ?? 0),
      penetrations: Math.floor(brandModel?.penetrations ?? 0),
      preferences: Math.floor(brandModel?.preferences ?? 0),
      recomendations: brandModel?.recomendations ?? [],
      spontaneousAwareness: brandModel?.spontaneousAwareness ?? 0,
      topSpontaneousAwareness: brandModel?.topSpontaneousAwareness ?? 0,
      aidedAwarenessToConsideration: Math.floor(aidedAwarenessToConsideration),
      aidedAwarenessToPenetration: Math.floor(aidedAwarenessToPenetration),
      considerationToPreference: Math.floor(considerationToPreference),
      segmentId,
    };
  }


  private static seriesName({ intervalIndex }: BrandResultModels): string {
    const date = TestReportUtils.getDateFromQuarter(intervalIndex);
    let quarter;
    const month = date.getMonth();
    if (month < 3) {
      quarter = 'Q1';
    } else if (month > 2 && month < 6) {
      quarter = 'Q2';
    } else if (month > 5 && month < 9) {
      quarter = 'Q3';
    } else {
      quarter = 'Q4';
    }

    return `${quarter}.${date.getFullYear()}`;
    //return formatDate(TestReportUtils.getDateFromQuarter(quorter), "MM yy", 'en').split(' ').join("'");
  }

  private static _monthName({ intervalIndex }: BrandResultModels): string {
    const date = TestReportUtils.getDateFromMonth(intervalIndex);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex === 0 ? 11 : monthIndex - 1];
    const year = date.getFullYear();
    return `${monthName}.${year}`;
  }

  private static _yearName({ intervalIndex }: BrandResultModels): number {
    return intervalIndex;
  }

  private static _weekNumber({ intervalIndex }: BrandResultModels): string {
    const date = TestReportUtils.getDateFromWeek(intervalIndex);

    const weekOfYear = (intervalIndex - 1) % 53;
    return `w${weekOfYear + 1}'${date.getFullYear().toString().slice(-2)}`;
  }

  private static brandResultModelsByBrand(brandResultModels: BrandResultModels[], { id }: BTBrand): BrandResultModels[] {
    return brandResultModels.filter(({ brandId }) => brandId === id).sort((a, b) => a.intervalIndex - b.intervalIndex);
  }

  public static getAverage(field: string, dataset: BrandFunnelDatasetModelItem[]): number {
    const total = dataset.reduce((accumulator, currentValue) => accumulator + currentValue[field], 0);
    return Math.round(total / dataset.length);
  }

  public static addOtherSegment({ isCustomSegmentation, isSegmentation, segments }: RespondentRequirements): void {
    const otherSegmentId = 'a9122bfd-2664-467b-570b-01d963a7fb19';
    const other = segments.find(({ id }) => id === otherSegmentId);
    if ((isCustomSegmentation || isSegmentation) && !other) {
      segments.push({
        id: otherSegmentId,
        isDefault: true,
        value: 'Other',
      });
    }
  }

  public static changeOtherSegmentToPopulation({ segments }: RespondentOptions | RespondentRequirements): void {
    if (segments && segments.length) {
      const otherSegmentId = 'a9122bfd-2664-467b-570b-01d963a7fb19';
      const otherInd = segments?.findIndex(({ id }) => id === otherSegmentId);
      segments.splice(otherInd, 1);
      segments.unshift({
        id: otherSegmentId,
        isDefault: true,
        value: 'Population',
      });
    }
  }

  public static translateSegments(testSegments: Segment[], respondentOptionsSegments: Segment[]): Segment[] {
    const segments = [];
    testSegments.forEach(item => {
      const swedenSegment = respondentOptionsSegments.find(segment => segment.id === item.id);
      segments.push(swedenSegment);
    });
    return segments;
  }

  public static translateDoNotKnowOption(columns: ColumnsCustomQuestions[], translateService: TranslateService): ColumnsCustomQuestions[] {
    return columns.map(item => {
      return {
        ...item,
        value: item.position === -1 ? translateService.instant("BIC.Don't know") : item.value,
      };
    });
  }

  public static sliceSingleGridQuestion(question: AdditionalQuestionsModel, parts = 10): AdditionalQuestionsModel[] {
    const res = [];
    question.feedback.forEach((feedback, ind) => {
      const partsNum = Math.ceil(feedback.rows.length / parts);
      for (let i = 0; i < partsNum; i++) {
        const newRes = {
          label: question.label,
          feedback: [{ ...feedback }],
          index: i,
          total: partsNum,
        };
        newRes.feedback[0].dataSet = [...newRes.feedback[0].dataSet.slice(i * parts, i * parts + parts)];
        newRes.feedback[0].rows = newRes.feedback[0].rows.slice(i * parts, i * parts + parts);
        res.push(newRes);
      }
    });
    return res;
  }

  public static segmentsByFilter(respondentRequirements: RespondentRequirements, filteredSegments: string[]): Segment[] {
    return (
      respondentRequirements.isCustomSegmentation
        ? [...respondentRequirements.customSegments]
        : respondentRequirements.segments.filter(segment => segment.value !== 'Population')
    ).filter(segment => filteredSegments.includes(segment.id));
  }

  public static getTestQuestions(customQuestions: CustomQuestions[], translateService: TranslateService): QuestionFeedback[] {
    return customQuestions.map(({ id, value, type, answerType, image, answers, columns }: AdditionalQuestionListItem) => ({
      id,
      label: value,
      answers: [],
      type,
      answerType,
      image,
      numberOfResp: 0,
      dataSet: [],
      rows: answers.length ? answers : [],
      columns: columns.length ? TestReportUtils.translateDoNotKnowOption(columns, translateService) : [],
    }));
  }

  public static roundLikes(data: AccumulatedLikes): AccumulatedLikes {
    return mapValues(data, item => mapValues(item, val => Math.round(val)));
  }

  public static getTotalRespondentCountForCustomQuestions(intervalTotals: Record<number, IntervalTotalItem>): number {
    return Object.values(intervalTotals).reduce((acc, cur) => acc + cur.totalRespondents, 0);
  }

  public static getCustomQuestionsMergeData(data: BtTestResultModel): {
    mergedData: IntervalResultModelsCustomQuestions;
  } {
    const mergedData = {
      accumulatedMulties: data.accumulatedMulties || [],
      accumulatedSingles: data.accumulatedSingles || [],
      accumulatedScales: data.accumulatedScales || [],
      accumulatedFeedbacks: data.accumulatedFeedbacks || [],
    };
    return { mergedData };
  }

  public static getIntervalTotalsPopulationLow(intervalTotals: IntervalTotals): boolean {
    let summ = 0;
    forIn(intervalTotals, (interval: IntervalTotalItem) => {
      summ += interval.totalRespondents ?? 0;
    });
    return summ < LOW_NUMBER_OF_RESPONDENTS;
  }

  public static getIntervalTotalsSegmentLow(availableSegments: ListItem[], intervalTotals: IntervalTotals, segmentId?: string | Record<string, any>): boolean {
    if (!segmentId || !availableSegments.length) {
      return TestReportUtils.getIntervalTotalsPopulationLow(intervalTotals);
    } else {
      let summ = 0;
      if (typeof segmentId === 'string') {
        forIn(intervalTotals, (interval: IntervalTotalItem) => {
          summ += interval.segmentTotals[segmentId] ?? 0;
        });
      } else {
        forIn(intervalTotals, (interval: IntervalTotalItem) => {
          for (const key in segmentId) {
            summ += interval.segmentTotals[key] ?? 0;
          }
        });
      }
      return summ < LOW_NUMBER_OF_RESPONDENTS;
    }
  }
}
