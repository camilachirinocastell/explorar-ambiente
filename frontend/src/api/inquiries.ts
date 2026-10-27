// frontend/src/api/inquiries.ts
// Calls to the inquiry endpoints of the backend. For now only the public one used by
// the contact form; the dashboard calls are added with the admin screens.

import type { InquiryFormValues } from '../schemas/inquiry.schema';
import { apiRequest } from './client';

export function sendInquiry(values: InquiryFormValues): Promise<{ received: boolean }> {
  return apiRequest<{ received: boolean }>('/inquiries', { method: 'POST', body: values });
}
