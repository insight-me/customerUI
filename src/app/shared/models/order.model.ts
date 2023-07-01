import { TestType } from '../enums/product.id.type';

export interface Order {
  id?: string;
  testId: string;
  testName: string;
  receiptId?: string;
  transactionId?: string;
  invoiceId?: string;
  amount: number;
  paymentIntentId?: string;
  paymentStatus?: string;
  userId?: string;
  userEmail?: string;
  companyId?: string;
}

export interface OrderResponse {
  id: string;
  testId: string;
  testName: string;
  receiptId: string;
  transactionId: string;
  invoiceId: string;
  amount: number;
  paymentLink: string;
  paymentIntentId: string;
  paymentStatus: number;
  userId: string;
  userEmail: string;
  companyId: string;
  orderNumber: number;
  paymentOrderNumber: string;
}

export interface OrderLibraryItem {
  azureReceiptUrl: string;
  amount: number;
  currency: string;
  id: string;
  orderDate: string;
  orderNumber: number;
  paymentStatus: number;
  paymentType: number;
  receptUrl: string;
  testId: string;
  testName: string;
  testType: TestType;
}
