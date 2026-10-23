// backend/src/config/env.config.ts
// Validates the process environment once at startup and exports a typed,
// read-only config object. If any variable is missing or invalid, the process
// exits with a readable report instead of failing later in an unrelated place.

import { z } from 'zod';

// Secrets must be long and must not be the placeholder copied from .env.example
const secret = z
  .string()
  .min(32, 'must be at least 32 characters long')
  .refine((value) => !value.startsWith('replace-with'), 'still has the .env.example placeholder');

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    DATABASE_URL: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\//, 'must start with mongodb:// or mongodb+srv://'),
    JWT_SECRET: secret,
    PASSWORD_PEPPER: secret,
    CLIENT_URL: z.url(),
    RESEND_API_KEY: z.string().startsWith('re_', 'must start with re_'),
  })
  // The pepper protects password hashes even if JWT_SECRET leaks, so they must differ
  .refine((env) => env.JWT_SECRET !== env.PASSWORD_PEPPER, {
    path: ['PASSWORD_PEPPER'],
    message: 'must be different from JWT_SECRET',
  });

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const report = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error(`Invalid environment variables:\n${report}`);
    process.exit(1);
  }

  return Object.freeze(result.data);
}

export const env = loadEnv();
