import { PaymentStatus } from './payment.model';
import { PaymentTypeBE } from '../enums/payment.type';
import { TestType } from '../enums/product.id.type';

export interface Invoice {
  id?: string;
  transactionNumber: number;
  nameProduct: string;
  totalAmount: number;
  created: string;
  testType: TestType;
  paymentStatus?: PaymentStatus;
  paymentType: PaymentTypeBE;
  currency?: string;
  receiptUrl?: string;
  invoiceUrl?: string;
  respondentCount?: number;
}

export enum InvoiceTable {
  companyName = 'confirm-test.company-name',
  address = 'confirm-test.address',
  companyStreet = 'confirm-test.address',
  city = 'confirm-test.city',
  companyCity = 'confirm-test.city',
  zip = 'confirm-test.zip',
  companyPostalCode = 'confirm-test.zip',
  companyContactName = 'confirm-test.company-person-name-first',
  contactName = 'confirm-test.company-person-name-first',
  companyContactSurname = 'confirm-test.company-person-last-name',
  contactSurname = 'confirm-test.company-person-last-name',
  companyContactMail = 'confirm-test.company-person-mail',
  firstName = 't-auth.First name',
  lastName = 't-auth.Last name',
  mail = 't-auth.E-mail',
  contactMail = 'confirm-test.company-person-mail',
  password = 't-auth.Password',
  oldPassword = 't-auth.Password',
  confirmPassword = 't-auth.Password',
  companyOrgNumber = 'confirm-test.org-num',
  companyAddress = 'confirm-test.address',
  vatNumber = 'payment.VAT number',
}
