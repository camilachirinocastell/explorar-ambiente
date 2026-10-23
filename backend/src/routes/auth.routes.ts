// backend/src/routes/auth.routes.ts
// Authentication routes, mounted under /api/v1/auth: login (public, with a strict
// rate limit), logout and the current-user lookup (requires a valid session).

import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { loginLimiter } from '../middlewares/rate-limiter.middleware';

export const authRouter = Router();

authRouter.post('/login', loginLimiter, login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);
