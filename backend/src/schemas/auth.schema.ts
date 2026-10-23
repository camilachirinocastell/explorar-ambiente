// backend/src/schemas/auth.schema.ts
// Zod schema for the login request body. It only checks shape and size: password
// strength rules apply when a password is created, not when it is checked.

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
