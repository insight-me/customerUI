import { KPITitle } from '../../app/shared/models/bic.test.report/KPIModel';
import { AgeGroup } from '../../app/shared/models/bic.test.report/test.result.filter.model';

export const UI_DATE_FORMAT = 'DD MMM YYYY';
export const UI_DATE_TIME_FORMAT = 'DD MMM YYYY HH:mm';
export const NO_ORDER_ID = '00000000-0000-0000-0000-000000000000';
// tslint:disable-next-line:max-line-length
export const PASSWORD_PATTERN =
  /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\-\\$%\^&\*\?\,\.\;\:\"\'\#\%\^\&\(\)\{\}\[\]\<\>\|\\\/\=\+\_\~\@\`])[\w!@#\-\\$%\^&\*\?\,\.\;\:\"\'\#\%\^\&\(\)\{\}\[\]\<\>\|\\\/\=\+\_\~\@\`]{8,}$/;
export const NUMBER_PATTERN = /^[^\.]+$/;
export const NO_SPACE_PATTERN = /.*\S.*/;
export const CONSTANT_PATTERN = /^(-?)[0-9]+([\\.|,][0-9]{1,3})?$/;
export const CONVERT_TO_PERSENTS = 100;
export const INPUT_MIN_LENGTH = 5;
export const INPUT_MIN_LENGTH__PASSWORD = 3;
export const INPUT_MAX_LENGTH = 200;
export const INPUT_MAX_LENGTH_NAME = 120;
export const INPUT_MAX_POSTAL_CODE = 20;
export const INPUT_MAX_COMPANY_ADDRESS = 250;
export const TEST_NAME_MAX_LENGTH = 50;
export const MAX_BENEFITS_AND_REASONS = 3;
export const MAX_ASSOCIATION = 40;
export const MAX_AGE = 75;
export const MIN_AGE = 18;
export const MAX_MARK_KPI = 7;
export const MAX_RECOMMENDATIONS_ITEMS = 11;
export const MAX_BRANDS_FOR_ASSOCIATION_STEP_BT = 8;
export const MAX_ROOT_ADMINS = 2;
export const DEBOUNCE_TIME_FOR_INPUT = 500;
export const FULL_PERCENTS = 100;
export const MOODBOARD_KOEF1 = 11.2;
export const MOODBOARD_KOEF2 = 0.01;
export const MAX_MOODBOARD_HEIGHT = 598;
export const ALL_SEGMENTS = 'report.All segments';
export const ALL_CUSTOM_SEGMENTS = 'confirm-test.All custom segments';
export const MIN_NUMBER_OF_RESPONDENTS = 200;
export const MAX_NUMBER_OF_RESPONDENTS = 1500;
export const MIN_NUMBER_OF_RESPONDENTS_FOR_SEGMENT = 100;
export const MIN_TEST_NAME_LENGTH = 5;
export const MAX_TEST_NAME_LENGTH = 50;
export const MIN_CONCEPT_NAME_LENGTH = 5;
export const MAX_CONCEPT_NAME_LENGTH = 50;
export const MIN_CONSUMER_INSIGHT_LENGTH = 50;
export const MIN_EXPLANATION_TEXT_LENGTH = 10;
export const MILISEC_IN_SEC = 1000;
export const SCROLL_DELAY = 100;
export const THEY = 'They';
export const THEY_SE = 'Annat';
export const ONLY_INTEGERS_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
export const ARRAY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const PDF_SENDING_TIME = 5000;
export const SCROLL_DEBOUNCE = 600;

export const DESKTOP_VERSION = 1024;
export const MOBILE_VERSION = 767;
export const MIDDLE_VERSION = 1153;
export const MOBILE_MINI_VERSION = 411;
export const MOBILE_MINIMUM_VERSION = 418;
export const MOBILE_MAX_VERSION = 841;
export const MONTHS_IN_FIRST = '1 month';
export const MONTHS_IN_YEAR = '1 year';

export const SEGMENT_TYPES = [
  'BIC.Use my own consumer segments',
  'BIC.Use InsightMe predefined consumer segments',
  'BIC.No specific consumer segment',
];

export const IMAGE_EXTENSION_TYPES = ['jpeg', 'png', 'jpg'];
export const COLORS: string[] = [
  '#AFEBAB',
  '#ADD9F4',
  '#8ED08A',
  '#FF776F',
  '#332F5B',
  '#8E8E93',
  '#000000',
  '#F9EF9A',
  '#FFA56F',
  '#F7C8D0',
  '#B8B2EA',
];
export const COLORS2: string[] = [
  '#FFA56F',
  '#F7C8D0',
  '#B8B2EA',
  '#AFEBAB',
  '#ADD9F4',
  '#8ED08A',
  '#FF776F',
  '#332F5B',
  '#8E8E93',
  '#000000',
  '#F9EF9A',
];
export const COLORS3: string[] = [
  '#F9EF9A',
  '#FFA56F',
  '#F7C8D0',
  '#B8B2EA',
  '#ADD9F4',
  '#AFEBAB',
  '#FF776F',
  '#95ECE1',
  '#DDB1F8',
  '#FF7EDB',
  '#BFB459',
  '#BAA996',
  '#A56872',
  '#675FA8',
  '#6395B4',
  '#6FA66B',
  '#9F312A',
  '#54A89D',
  '#9970B1',
  '#9D2A7D',
];
export const COLORS4: string[] = [
  '#FFA56F',
  '#8ED08A',
  '#F7C8D0',
  '#ADD9F4',
  '#B8B2EA',
];
export const COLORS_FOR_SCALE: string[] = [
  '#AFEBAB',
  '#AFEBAB',
  '#AFEBAB',
  '#ADD9F4',
  '#B8B2EA',
  '#B8B2EA',
  '#B8B2EA',
  '#FCFCFC',
];
export const COLORS5: string[] = [
  '#6FA66B',
  '#AFEBAB',
  '#B8B2EA',
  '#F9EF9A',
  '#FF7EDB',
  '#ADD9F4',
  '#FFA56F',
  '#95ECE1',
  '#F7C8D0',
  '#675FA8',
];
export const RELEVANCE_COLORS = [
  '#FF776F',
  '#AFEBAB',
  '#ADD9F4',
  '#FFA56F',
];
export const GRADIRNT_COLORS: string[] = [
  '#FFA56F',
  '#AFEBAB',
  '#ADD9F4',
  '#F7C8D0',
  '#B8B2EA',
  '#F9EF9A',
  '#FF7EDB',
  '#9970B1',
];
export const OVERALL_SCORE_VERTICAL_BAR_CHART_GRADIENT_COLORS: string[] = [
  '#AFEBAB',
  '#FFA56F',
  '#B8B2EA',
  '#ADD9F4',
  '#F7C8D0',
  '#95ECE1',
  '#F9EF9A',
  '#F7C8D0',
  '#6395B4',
  '#FF7EDB',
];

export const OVERALL_SCORE_BUBBLE_CHART_COLORS: string[] = [
  '#8ED08A',
  '#FFA56F',
  '#B8B2EA',
  '#ADD9F4',
  '#DDB1F8',
  '#95ECE1',
  '#F9EF9A',
  '#F7C8D0',
  '#6395B4',
  '#FF7EDB',
];

export const ROLES = [
  {
    label: 'RootAdmin',
    value: 0,
  },
  {
    label: 'Admin',
    value: 1,
  },
  {
    label: 'Manager',
    value: 2,
  },
];
export const ROLES_WITHOUT_ROOT_ADMIN = [
  {
    label: 'Admin',
    value: 1,
  },
  {
    label: 'Manager',
    value: 2,
  },
];
export const KPI_NAME = {
  [KPITitle.SpontaneousAwareness]: 'report.Spontaneous awareness',
  [KPITitle.TopOfMindSpontaneousAwareness]:
    'report.Top of mind spontaneous awareness',
  [KPITitle.AidedAwareness]: 'report.Aided awareness',
  [KPITitle.Consideration]: 'report.Consideration',
  [KPITitle.Preference]: 'report.Preference',
  [KPITitle.Penetration]: 'report.Penetration',
  [KPITitle.ToggleSpontaneousAwareness]: 'report.Spontaneous awareness',
  [KPITitle.ToggleAidedAwareness]: 'report.Aided awareness',
  [KPITitle.ToggleConsideration]: 'report.Consideration',
  [KPITitle.TogglePreference]: 'report.Preference',
  [KPITitle.TogglePenetration]: 'report.Penetration',
};

export const IS_COOKIE_ALLOWED = 'Is_cookie_allowed';

export const AGE_GROUPS_FOR_REPORT: AgeGroup[] = [
  {
    name: '15-24',
    min: 15,
    max: 24,
    id: 0,
  },
  {
    name: '25-34',
    min: 25,
    max: 34,
    id: 1,
  },
  {
    name: '35-44',
    min: 35,
    max: 44,
    id: 2,
  },
  {
    name: '45-54',
    min: 45,
    max: 54,
    id: 3,
  },
  {
    name: '55-64',
    min: 55,
    max: 64,
    id: 4,
  },
  {
    name: '65-75',
    min: 65,
    max: 75,
    id: 5,
  },
];
