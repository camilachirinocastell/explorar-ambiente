// frontend/src/api/inquiries.ts
// Calls to the inquiry endpoints of the backend: the public one used by the contact
// form, and the ones of the admin panel (they need a session).

import type { ClientType, InquiryStatus, ServiceType } from '../constants/inquiry-options';
import type { InquiryFormValues } from '../schemas/inquiry.schema';
import { apiRequest } from './client';

// Mirrors the InquiryDto of the backend; dates arrive as ISO strings because of JSON
export interface Inquiry {
  id: string;
  clientType: ClientType;
  clientName: string;
  companyOrLocation?: string;
  email: string;
  phone?: string;
  requestedService: ServiceType;
  message: string;
  privacyAccepted: boolean;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryPage {
  items: Inquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListInquiriesParams {
  status?: InquiryStatus;
  page?: number;
  limit?: number;
}

export function sendInquiry(values: InquiryFormValues): Promise<{ received: boolean }> {
  return apiRequest<{ received: boolean }>('/inquiries', { method: 'POST', body: values });
}

// Newest first (the backend sorts them); without params it returns the first page
export function listInquiries(params: ListInquiriesParams = {}): Promise<InquiryPage> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const queryString = query.toString();
  return apiRequest<InquiryPage>(queryString ? `/inquiries?${queryString}` : '/inquiries');
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
  const data = await apiRequest<{ inquiry: Inquiry }>(`/inquiries/${id}`, {
    method: 'PATCH',
    body: { status },
  });
  return data.inquiry;
}
