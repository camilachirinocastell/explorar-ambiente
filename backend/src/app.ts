// backend/src/app.ts
// Builds the Express application: proxy trust, security headers, CORS with credentials,
// general rate limit, body and cookie parsing, routes and the global error handling.
// It does not listen on a port, so tests can import it; server.ts starts it.

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.config';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { authRouter } from './routes/auth.routes';
import { healthRouter } from './routes/health.routes';
import { inquiryRouter } from './routes/inquiry.routes';
import { AppError } from './utils/app-error';

export const app = express();

// Behind Vercel and Render the address of the socket is always a proxy. Trusting the right
// number of hops makes req.ip the visitor's address, which every rate limit depends on:
// with too few hops all visitors would share one limit, with too many a visitor could fake
// their IP. The value comes from TRUST_PROXY_HOPS (0 locally, where there is no proxy)
if (env.TRUST_PROXY_HOPS > 0) {
  app.set('trust proxy', env.TRUST_PROXY_HOPS);
}

app.use(helmet());

// Credentials (cookies) require one explicit origin, never a wildcard
app.use(cors({ origin: new URL(env.CLIENT_URL).origin, credentials: true }));

// General limit per IP, applied before body parsing so malformed requests and
// unknown routes count too. Sensitive routes (login, inquiries) have stricter limits
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new AppError(429, 'TOO_MANY_REQUESTS', 'Too many requests, please try again later'));
  },
});

app.use(generalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/inquiries', inquiryRouter);

app.use(notFoundHandler);
app.use(errorHandler);
