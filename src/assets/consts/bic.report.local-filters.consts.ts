import { BtMultiselectFilter } from '../../app/shared/models/bt.test.report/bt.multiselect.filter.model';

export const CONCEPT_LOCAL_FILTER = [
  {
    filterName: 'Concepts',
    isMulti: true,
    formControlName: 'concepts',
    options: [],
    allLabel: 'report.All concepts',
  },
];

export const CONCEPT_LOCAL_FILTER_SINGLE = [
  {
    filterName: 'Concepts',
    isMulti: false,
    formControlName: 'concepts',
    options: [],
  },
];

export const ASSOCIATIONS_SINGLE_LOCAL_FILTER = [
  {
    filterName: 'Concepts',
    isMulti: false,
    formControlName: 'concepts',
    options: [],
  },
  {
    filterName: 'Associations',
    isMulti: true,
    formControlName: 'associations',
    options: [],
    allLabel: 'report.All associations',
  },
];
export const ASSOCIATIONS_MULTI_LOCAL_FILTER = [
  {
    filterName: 'Concepts',
    isMulti: true,
    formControlName: 'concepts',
    options: [],
    allLabel: 'report.All concepts',
  },
  {
    filterName: 'Associations',
    isMulti: true,
    formControlName: 'associations',
    options: [],
    allLabel: 'report.All associations',
  },
];

export const WORDS_LIKES_LOCAL_FILTER = [
  {
    filterName: 'Concepts',
    isMulti: false,
    formControlName: 'concepts',
    options: [],
  },
  {
    filterName: 'Likes&Dislikes',
    isMulti: true,
    formControlName: 'likes',
    options: [
      {
        value: 'Likes',
        id: 'like',
      },
      {
        value: 'Dislikes',
        id: 'dislike',
      },
    ],
  },
];

export const BIC_SINGLE_GRID_LOCAL_FILTER: BtMultiselectFilter[] = [
  {
    filterName: 'Options',
    isMulti: true,
    formControlName: 'options',
    options: [],
  },
];
