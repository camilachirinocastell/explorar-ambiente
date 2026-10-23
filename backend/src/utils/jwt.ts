// backend/src/utils/jwt.ts
// Signs and verifies the session token stored in the httpOnly cookie. The token
// carries the user id (as "sub") and the role; the auth middleware and the login
// route use these helpers and the same lifetime for the token and the cookie.

import { sign, verify } from 'jsonwebtoken';
import { env } from '../config/env.config';
import type { UserRole } from '../types/domain.types';

export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

export interface SessionTokenPayload {
  userId: string;
  role: UserRole;
}

export function signSessionToken({ userId, role }: SessionTokenPayload): string {
  return sign({ role }, env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: userId,
    expiresIn: SESSION_DURATION_SECONDS,
  });
}

// Throws if the token is expired, tampered with or has an unexpected shape
export function verifySessionToken(token: string): SessionTokenPayload {
  const decoded = verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });

  if (
    typeof decoded === 'string' ||
    typeof decoded.sub !== 'string' ||
    (decoded.role !== 'admin' && decoded.role !== 'engineer')
  ) {
    throw new Error('Invalid session token payload');
  }

  return { userId: decoded.sub, role: decoded.role };
}
