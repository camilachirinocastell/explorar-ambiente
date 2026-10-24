// backend/src/schemas/inquiry.schema.ts
// Zod schemas for the inquiry routes: the public contact form, the status change and
// the dashboard listing filters. The allowed values come from domain.types.ts, the
// same lists the Mongoose model uses.

import { z } from 'zod';
import { CLIENT_TYPES, INQUIRY_STATUSES, SERVICE_TYPES } from '../types/domain.types';

// Forms send empty optional fields as "": treat them as missing
function emptyToUndefined(value: string | undefined): string | undefined {
  return value === '' ? undefined : value;
}

export const createInquirySchema = z.object({
  clientType: z.enum(CLIENT_TYPES),
  clientName: z.string().trim().min(2).max(100),
  companyOrLocation: z.string().trim().max(150).optional().transform(emptyToUndefined),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[\d+()\s-]{6,}$/, 'Invalid phone number')
    .or(z.literal(''))
    .optional()
    .transform(emptyToUndefined),
  requestedService: z.enum(SERVICE_TYPES),
  message: z.string().trim().min(10).max(2000),
  // Required by Ley 25.326: the form cannot be sent without accepting the policy
  privacyAccepted: z.literal(true, { error: 'The privacy policy must be accepted' }),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
});

export const listInquiriesQuerySchema = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type ListInquiriesQuery = z.infer<typeof listInquiriesQuerySchema>;
