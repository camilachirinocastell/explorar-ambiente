// backend/src/middlewares/auth.middleware.ts
// Protects private routes: reads the session cookie, verifies the token and leaves
// the user id and role in res.locals for the route handlers. Any failure becomes a
// 401 in the standard error format.

import type { RequestHandler, Response } from 'express';
import type { SessionTokenPayload } from '../utils/jwt';
import { verifySessionToken } from '../utils/jwt';
import { AppError } from '../utils/app-error';
import { SESSION_COOKIE_NAME } from '../utils/session-cookie';

export const requireAuth: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.[SESSION_COOKIE_NAME];

  if (typeof token !== 'string' || token === '') {
    next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required'));
    return;
  }

  try {
    res.locals.auth = verifySessionToken(token);
    next();
  } catch {
    next(new AppError(401, 'INVALID_SESSION', 'Invalid or expired session'));
  }
};

// Use inside handlers that run after requireAuth
export function getAuth(res: Response): SessionTokenPayload {
  return res.locals.auth as SessionTokenPayload;
}
