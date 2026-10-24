// backend/src/types/domain.types.ts
// Shared domain types for the backend. Models, schemas and services import
// their entity shapes from here so each concept is defined only once. Allowed
// values live in constant lists, and the types are derived from them, so the
// Mongoose models and the Zod schemas can reuse the same lists.

export type UserRole = 'admin' | 'engineer';

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const SERVICE_TYPES = [
  'native_forest_plan',
  'firebreak_plan',
  'prescribed_burn_plan',
  'fauna_monitoring',
  'eia',
  'gis_mapping',
  'environmental_education',
  'urban_forestry',
  'other', // fallback value, not a ninth service
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

// Used only by landing inquiries
export const CLIENT_TYPES = ['individual_producer', 'company', 'municipality'] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const INQUIRY_STATUSES = ['pending', 'reviewed', 'contacted'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface IContactInquiry {
  id: string;
  clientType: ClientType;
  clientName: string;
  companyOrLocation?: string;
  email: string;
  phone?: string;
  requestedService: ServiceType;
  message: string;
  privacyAccepted: boolean; // required by Ley 25.326
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}
