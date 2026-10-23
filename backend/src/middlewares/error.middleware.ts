// backend/src/middlewares/error.middleware.ts
// Last middlewares of the Express app: one answers unknown routes with a 404 and
// the other turns any error into the standard response
// { success: false, error: { code, message, details } }.

import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

interface ClientHttpError {
  status: number;
  type?: string;
  message: string;
}

// Errors raised by Express itself (for example malformed JSON bodies) carry a
// 4xx "status" and are safe to report to the client
function isClientHttpError(error: unknown): error is ClientHttpError {
  if (typeof error !== 'object' || error === null) return false;
  const { status, expose } = error as { status?: unknown; expose?: unknown };
  return typeof status === 'number' && status >= 400 && status < 500 && expose === true;
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`));
};

// Express recognizes an error handler by its four parameters, so "_next" must stay
export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: { code: error.code, message: error.message, details: error.details },
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (isClientHttpError(error)) {
    res.status(error.status).json({
      success: false,
      error: {
        code: error.type === 'entity.parse.failed' ? 'INVALID_JSON' : 'BAD_REQUEST',
        message: error.message,
        details: null,
      },
    });
    return;
  }

  // Unknown failure: log it, but never leak internals to the client
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error', details: null },
  });
};
