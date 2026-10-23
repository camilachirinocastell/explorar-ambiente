// backend/src/utils/session-cookie.ts
// Name and options of the httpOnly cookie that carries the session token. The login
// route sets it, the logout route clears it and the auth middleware reads it, so all
// three share these definitions.

import type { CookieOptions } from 'express';
import { env } from '../config/env.config';
import { SESSION_DURATION_SECONDS } from './jwt';

export const SESSION_COOKIE_NAME = 'session';

// "secure" is only enforced in production: local development runs over plain http
function baseOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };
}

export function sessionCookieOptions(): CookieOptions {
  return { ...baseOptions(), maxAge: SESSION_DURATION_SECONDS * 1000 };
}

// The browser only removes a cookie when these attributes match the ones it was set with
export function clearSessionCookieOptions(): CookieOptions {
  return baseOptions();
}
