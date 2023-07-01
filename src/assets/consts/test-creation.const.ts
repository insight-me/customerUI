import { OpenQuestionOptionsOrder } from '../../app/shared/enums/bic.creation.type';
import { OrderOpenQuestionsOptions } from '../../app/shared/models/test-creation.model';

export const MAX_IMAGE_SIZE_BT = 2097152;
export const ONE_AND_HALF_MB_IN_BYTE = 1572864;
export const MAX_IMAGES_LENGTH_BT = 20;
export const MIN_BRAND_NAME_LENGTH = 2;
export const MAX_BRAND_NAME_LENGTH = 30;
export const MAX_ASSOCIATION_FOR_BT_TEST = 20;
export const MIN_OPEN_QUESTION_OPTION_LENGTH = 10;
export const MAX_OPEN_QUESTION_OPTION_LENGTH = 200;
export const OPTION_MIN_LENGTH = 5;
export const OPTION_MAX_LENGTH = 50;
export const SEC_IN_MIN = 60;
export const DAYS_ON_MONTH_END = 6;
export const NO_PARAMETER = 0;
export const LEFT_TRIM_PATTERN = /^\s*|\s(?=\s)/g;
export const MIN_RESP_NUMBER_NO_SEGMENTS = 200;
export const MIN_RESP_NUMBER_PER_SEGMENT = 100;
export const MAX_RESP_NUMBER = 1500;
export const MAX_RESP_NUMBER_BIC = 1500;
export const MIN_CUSTOM_CATEGORY_LENGTH = 2;
export const MAX_CUSTOM_CATEGORY_LENGTH = 30;
export const MIN_IR = 1;
export const MAX_IR = 100;
export const MAX_WIDTH = 100;
export const MIN_ASSOCIATIONS_COUNT = 5;
export const MAX_CATEGORY_DESCRIPTION = 200;
export const TOAST_DELAY = 9000;
export const IN_PERCENTS = 100;
export const MAX_BIC_TIME = 25;
export const DESKTOP_ARROW_SHIFT = 42;
export const MOBILE_ARROW_SHIFT = 85;
export const MIN_AGE_SPAN = 29;
export const MAX_MIN_AGE = 46;
export const MIN_MAX_AGE = 47;
export const MIN_BENEFITS_RTB_WORDS = 2;
export const MAX_BENEFITS_RTB_WORDS = 25;
export const MIN_CONSUMER_INSIGHT_WORDS = 10;
export const MAX_CONSUMER_INSIGHT_WORDS = 70;

export const OTHER_SEGMENT = 'other';
export const OTHER_SE_SEGMENT = 'annat';
export const OTHER_SEGMENT_ID = '60820504-872d-4b20-8dda-c607067e2ee6';
export const NO_VALUE_GUIDE = '00000000-0000-0000-0000-000000000000';

/** Progress consts */
export const NO_WIDTH = 0;
export const BY_THREE_PARTS = 3;
export const BY_TWO_PARTS = 2;
export const FIFTH_PART = 20;
export const HALF_PART = 50;
export const FOURTH_PART = 25;
export const PROGRESS_FOR_LAST_STEP_BT = 14.3;
export const FIVE_PARTS = 5;
export const SIX_PARTS = 6;
export const EIGHT_PARTS = 8;
export const ONE_PART = 1;
export const ONE_ELEMENT_IN_ARRAY = 1;
export const WIDTH_EIGHTY = 80;
export const MIN_MONTHES = 2;

export const BT_NAV_ITEMS = [
  {
    title: 'Section 1',
    text: 'BT-create.Intro',
    link: `section-1`,
  },
  {
    title: 'Section 2',
    text: 'BT-create.Choose respondents',
    link: `section-2`,
  },
  {
    title: 'Section 3',
    text: 'BT-create.Brands',
    link: `section-3`,
  },
  {
    title: 'Section 4',
    text: 'BT-create.KPIs',
    link: `section-4`,
  },
  {
    title: 'Section 5',
    text: 'BT-create.Associations',
    link: `section-5`,
  },
  {
    title: 'Section 6',
    text: 'BT-create.Additional questions',
    link: `section-6`,
  },
  {
    title: 'Section 7',
    text: 'BT-create.Start date',
    link: `section-7`,
  },
  {
    title: 'Section 8',
    text: 'BT-create.Confirm & Run',
    link: `section-8`,
  },
];

export const SEGMENTATION_NAV = [
  {
    title: 'Section 5',
    text: 'segmentation.section-1',
    link: `1`,
  },
  {
    title: 'Section 5',
    text: 'segmentation.section-2',
    link: `2`,
  },
  {
    title: 'Section 5',
    text: 'segmentation.section-3',
    link: `3`,
  },
  {
    title: 'Section 5',
    text: 'segmentation.section-4',
    link: `4`,
  },
];
export const DURATION_OPTIONS = [
  {
    label: 'bt-section-six-bt.12-months',
    value: 12,
  },
  {
    label: 'bt-section-six-bt.24-months',
    value: 24,
  },
  {
    label: 'bt-section-six-bt.36-months',
    value: 36,
  },
];

export const ORDER_OPEN_QUESTIONS_OPTIONS: OrderOpenQuestionsOptions[] = [
  {
    name: 'BIC.Show in order',
    value: OpenQuestionOptionsOrder.Order,
  },
  {
    name: 'BIC.Show randomly',
    value: OpenQuestionOptionsOrder.Random,
  },
  {
    name: 'BIC.Show alphabetically',
    value: OpenQuestionOptionsOrder.Alphabetic,
  },
];

export const CUSTOM_QUESTION_ANSWER_TYPE_TEXT = {
  0: 'BIC.Text',
  1: 'BIC.Scale',
  2: 'BIC.Single choice',
  3: 'BIC.Multiple choice',
  4: 'BIC.Multi choice grid',
  5: 'BIC.Single choice grid',
};

export const PAGES_DROPDOWN_ITEMS = [
  {
    name: 'report.Show 10 answers per page',
    num: 10,
  },
  {
    name: 'report.Show 25 answers per page',
    num: 25,
  },
  {
    name: 'report.Show 50 answers per page',
    num: 50,
  },
];
