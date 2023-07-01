import { FormControl } from '@angular/forms';
import { CustomQuestionType } from '../enums/bic.custom-questions.type';
import { IAgeGroups, ListItem } from './test.model';

export interface SubheaderElement {
  title: string;
  text: string;
  link: string;
}

export interface RespondentOptions {
  segments: Segment[];
  ageGroups: IAgeGroups[];
  genders: ListItem[];
  purchaseFrequencies: ListItem[];
  purchaseInvolvements: ListItem[];
}

export interface Segment {
  id?: string;
  value: string;
  isDefault: boolean;
  ir?: number;
}

export interface RadioBtnsOpenQuestions {
  name: string;
  formControl: FormControl;
  value: CustomQuestionType;
  withHint: boolean;
  hintText?: string;
}

export interface OrderOpenQuestionsOptions {
  name: string;
  value: number;
}

export interface IsAllOrNoSegmentation {
  isAllSegments: boolean;
  isNoSegments: boolean;
}
