// backend/src/middlewares/rate-limiter.middleware.ts
// Stricter rate limits for sensitive routes, on top of the general limit set in
// app.ts. Rejected requests use the standard error format.

import { rateLimit } from 'express-rate-limit';
import { AppError } from '../utils/app-error';

// Login: 10 failed attempts per IP every 15 minutes. Successful logins do not count,
// so a real user is never locked out by their own correct sign-ins
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError(
        429,
        'TOO_MANY_LOGIN_ATTEMPTS',
        'Too many login attempts, please try again later',
      ),
    );
  },
});

// Public contact form: 5 inquiries per IP every hour. Enough for a real person who
// fixes a mistake and sends again, and a small ceiling for automated spam
export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError(429, 'TOO_MANY_INQUIRIES', 'Too many inquiries sent, please try again later'),
    );
  },
});
