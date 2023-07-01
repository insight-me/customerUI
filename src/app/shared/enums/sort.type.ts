export enum SortType {
  Unordered = 0,
  Ascending = 1,
  Descending = 2
}

export enum SortingType {
  Contains = 0,
  Equal = 1,
  NotEqual = 2,
  GreaterThan = 3,
  LessThan = 4,
  GreaterThanOrEqual = 5,
  LessThanOrEqual = 6,
  StartsWith = 7
}

export enum TestLibraryFilterType {
  TestType = 'testType',
  Status = 'status'
}

export enum OrderLibraryFilterType {
  TestType = 'testType',
  Status = 'invoicePaymentStatus',
  PaymentType = 'paymentType'
}
