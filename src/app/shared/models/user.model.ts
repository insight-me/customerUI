export interface User {
  id?: string;
  countRootAdmins?: number;
  password?: string;
  firstName: string;
  lastName: string;
  mail: string;
  companyName: string;
  companyOrgNumber: string;
  companyCountry: string;
  preferredLanguage: string;
  companyId?: string;
  email?: string;
  securityLevel: number;
  permission?: string;
  fullName?: string;
  isLocked: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export enum RoleType {
  RootAdmin = 0,
  Admin = 1,
  Manager = 2
}

export enum FormFields {
  'password'
}
