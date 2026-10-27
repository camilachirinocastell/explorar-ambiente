// frontend/src/schemas/inquiry.schema.ts
// Zod schema of the contact form, used by React Hook Form to validate before
// sending. It mirrors backend/src/schemas/inquiry.schema.ts (the server validates
// again) but has no transforms, so the form values and the request body have the
// same shape. Empty optional fields are sent as "" and the backend ignores them.

import { z } from 'zod';
import { CLIENT_TYPES, SERVICE_TYPES } from '../constants/inquiry-options';

export const inquirySchema = z.object({
  clientType: z.enum(CLIENT_TYPES, { error: 'Elegí quién consulta' }),
  clientName: z.string().trim().min(2, 'Ingresá tu nombre').max(100, 'Máximo 100 caracteres'),
  companyOrLocation: z.string().trim().max(150, 'Máximo 150 caracteres'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'Máximo 254 caracteres')
    .pipe(z.email('Ingresá un email válido')),
  phone: z
    .string()
    .trim()
    .max(30, 'Máximo 30 caracteres')
    .refine(
      (value) => value === '' || /^[\d+()\s-]{6,}$/.test(value),
      'Ingresá un teléfono válido',
    ),
  requestedService: z.enum(SERVICE_TYPES, { error: 'Elegí un servicio' }),
  message: z
    .string()
    .trim()
    .min(10, 'Contanos un poco más (mínimo 10 caracteres)')
    .max(2000, 'Máximo 2000 caracteres'),
  privacyAccepted: z
    .boolean()
    .refine((value) => value, 'Tenés que aceptar la política de privacidad'),
  // Honeypot (D43): hidden from people, bots fill it. It is never validated here
  website: z.string(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
