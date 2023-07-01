export interface KPIModel {
  answerType?: KPIAnswerType;
  benchmarkValue?: number;
  id?: string;
  isRequired?: boolean;
  maxValue?: number;
  minValue?: number;
  question?: string;
  title: KPITitle;
  type?: KPIType;
}

export enum KPIType {
  Default = 0,
  Standard = 1,
  Recommended = 2,//Delete
  Additional = 3
}

export enum KPIAnswerType {
  Numeric = 0,
  PurchaseFrequency = 1
}

export enum KPITitle {
  /*BIC*/
  Likeability = 'Likeability',
  PurchaseIntent = 'Purchase intent',
  PurchaseFrequency = 'Purchase frequency',
  CurrentBrandLikeability = 'Brand likeability',
  Uniqueness = 'Uniqueness',
  Relevance = 'Relevance',
  Trustworthiness = 'Trustworthiness',
  Brandfit = 'Brand fit',

  /*BT*/
  SpontaneousAwareness = 'spontaneousAwareness',
  TopOfMindSpontaneousAwareness = 'topSpontaneousAwareness',
  AidedAwareness = 'aidedAwareness',
  Consideration = 'considerations',
  Preference = 'preferences',
  Penetration = 'penetrations',

  /*BT (Moving Average)*/
  ToggleSpontaneousAwareness = 'toggleSpontaneousAwareness',
  ToggleTopOfMindSpontaneousAwareness = 'toggleTopSpontaneousAwareness',
  ToggleAidedAwareness = 'toggleAidedAwareness',
  ToggleConsideration = 'toggleConsiderations',
  TogglePreference = 'togglePreferences',
  TogglePenetration = 'togglePenetrations'
}

export enum KPITooltips {
  'Likeability' = 'report.Do you like the idea described?',
  'Purchase intent' = 'report.How likely would you be to buy a product/service from the idea described?',
  'Brand likeability' = 'report.Would this idea make you like the current brand more or less?',
  'Uniqueness' = 'report.To what extent do you think this idea differs from others already on the market today?',
  'Relevance' = 'report.How relevant do you think the idea described is?',
  'Trustworthiness' = 'report.How trustworthy is the idea described?',
  'Brand fit' = 'report.How well do you think the idea matches the brand?',
}
