export interface Payment {
  priceInCent: number;
  currency: string;
  orderId: string;
  orderDescription: string;
  successUrl: string;
  failUrl: string;
}

export interface CardPaymentPayload {
  priceInCent: number;
  currency: string;
  orderId: string;
  orderDescription: string;
  companyName: string;
  orgNumber: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  companyContactName: string;
  companyContactSurname: string;
  companyContactMail: string;
  receiptData: string;
}

export interface InvoicePayment {
  priceInCent: number;
  currency: string;
  orderId: string;
  orderDescription: string;
  companyName: string;
  orgNumber: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  companyContactName: string;
  companyContactSurname: string;
  companyContactMail: string;
  receiptData: string;
  numberOfRespondents: number;
}

export enum PaymentStatus {
  Pending = 0,
  InitialPayed = 1,
  WebhookPaid = 2,
  Failed = 3,
  Refund = 4,
  Dispute = 5,
  Success = 6,
  BankTransaction = 7,
}

export enum PaymentType {
  Invoice = 1,
  Card = 2,
}

export enum PaymentTypeInArray {
  Invoice = 0,
  Card = 1,
}

export interface PaymentTypes {
  id: number;
  label: string;
  cards?: string[];
}
