// backend/src/controllers/auth.controller.ts
// HTTP layer of authentication: validates the request, calls the auth service and
// sets or clears the session cookie. Errors thrown here (including Zod validation
// errors) reach the global error handler.

import type { RequestHandler } from 'express';
import { getAuth } from '../middlewares/auth.middleware';
import { loginSchema } from '../schemas/auth.schema';
import { getCurrentUser, loginUser } from '../services/auth.service';
import {
  clearSessionCookieOptions,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '../utils/session-cookie';

export const login: RequestHandler = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const { token, user } = await loginUser(email, password);

  res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  res.json({ success: true, data: { user } });
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, clearSessionCookieOptions());
  res.status(204).end();
};

export const me: RequestHandler = async (_req, res) => {
  const { userId } = getAuth(res);
  const user = await getCurrentUser(userId);

  res.json({ success: true, data: { user } });
};
