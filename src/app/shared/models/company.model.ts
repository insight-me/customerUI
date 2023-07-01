export interface Company {
  id?: string;
  companyName: string;
  orgNumber: string;
  postalCode: string;
  countryCode: string;
  city: string;
  street: string;
  subdivision: string;
  logotypeUrl: string;
  companyAddress?: string;
  contactMail: string;
  contactName: string;
  contactSurname: string;
  deletionCode: string;
  deletionCodeExpirationTime: string;
  region: string;
  state: string;
  stripeCustomerID: string;
  vatNumber: number;
  isApproved: boolean;
  isApprovedVATNumber: boolean;
}
