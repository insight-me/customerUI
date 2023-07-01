import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { BtMultiselectFilter } from '../../app/shared/models/bt.test.report/bt.multiselect.filter.model';

export const OVERLAY_POSITION_PAIRS: ConnectionPositionPair[] = [
  {
    offsetX: 0,
    offsetY: 4,
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    panelClass: null,
  },
];

export const SCORE_CARD_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
];

export const BRAND_PERFOMANCE_OVER_TIME_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
  {
    filterName: 'KPIs',
    isMulti: true,
    formControlName: 'kpis',
    options: [],
    allLabel: 'report.All KPIs'
  },
];

export const TARGET_GROUP_PERFORMANCE_OVER_TIME_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: true,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
  {
    filterName: 'KPIs',
    isMulti: false,
    formControlName: 'kpis',
    options: [],
  },
];

export const COMPETITORS_PERFORMANCE_OVER_TIME_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: true,
    formControlName: 'brands',
    options: [],
    allLabel: 'report.All brands',
  },
  {
    filterName: 'KPIs',
    isMulti: false,
    formControlName: 'kpis',
    options: [],
  },
];

export const BRAND_FUNNEL: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: true,
    formControlName: 'brands',
    options: [],
    allLabel: 'report.All brands',
  },
];

export const ASSOCIATIONS_OVER_TIME_COMPARED_TO_COMPETITORS: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: true,
    formControlName: 'brands',
    options: [],
    allLabel: 'report.All brands',
  },
  {
    filterName: 'Associations',
    isMulti: false,
    formControlName: 'associations',
    options: [],
  },
];

export const ASSOCIATIONS_OVER_TIME_PER_PERIOD: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
  {
    filterName: 'Associations',
    isMulti: true,
    formControlName: 'associations',
    options: [],
  },
];

export const ASSOCIATIONS_IN_TARGET_GROUP: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: true,
    formControlName: 'segments',
    allLabel: 'report.All segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
  {
    filterName: 'Associations',
    isMulti: true,
    formControlName: 'associations',
    allLabel: 'report.All associations',
    options: [],
  },
];

export const SINGLE_GRID_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Options',
    isMulti: true,
    formControlName: 'options',
    options: [],
  },
];

export const ONLY_SEGMENTS_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
];

export const AD_AWARENESS_MAIN_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
    setFirst: true,
  },
  {
    filterName: 'Brands',
    isMulti: true,
    formControlName: 'brands',
    options: [],
    allLabel: 'report.All brands',
  },
];

export const AD_AWARENESS_OVER_TIME_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
    setFirst: true,
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
  {
    filterName: 'KPIs',
    isMulti: true,
    formControlName: 'kpis',
    options: [],
  },
];

export const NET_PROMOTER_SCORE_MAIN_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: true,
    formControlName: 'brands',
    options: [],
    allLabel: 'report.All brands',
  },
];

export const NET_PROMOTER_SCORE_OVER_SCORE_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Segments',
    isMulti: false,
    formControlName: 'segments',
    options: [],
  },
  {
    filterName: 'Brands',
    isMulti: false,
    formControlName: 'brands',
    options: [],
  },
];
