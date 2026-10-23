// backend/src/utils/app-error.ts
// Error class for failures the API expects and wants to report to the client
// (not found, forbidden, invalid input). The global error middleware turns it
// into the standard error response; any other error becomes a generic 500.

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown;

  constructor(statusCode: number, code: string, message: string, details: unknown = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
