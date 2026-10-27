// frontend/src/api/client.ts
// Small fetch wrapper for the backend API. It builds the URL from VITE_API_URL, sends
// and receives JSON, includes the session cookie and turns every failure into an
// ApiError, so the screens handle one kind of error. Successful responses are
// unwrapped from the { success, data } envelope.

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, code: string, message: string, details: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
}

// Reads { success: false, error: { code, message, details } } defensively: the
// answer may also come from a proxy or a crash and not follow the format
function readError(payload: unknown): { code: string; message: string; details: unknown } {
  const fallback = {
    code: 'UNKNOWN_ERROR',
    message: 'Ocurrió un error inesperado',
    details: null,
  };
  if (typeof payload !== 'object' || payload === null || !('error' in payload)) return fallback;

  const error = payload.error;
  if (typeof error !== 'object' || error === null) return fallback;

  const { code, message, details } = error as Record<string, unknown>;
  return {
    code: typeof code === 'string' ? code : fallback.code,
    message: typeof message === 'string' ? message : fallback.message,
    details: details ?? null,
  };
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) throw new Error('VITE_API_URL is not set');

  const hasBody = options.body !== undefined;
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }

  // 204 (logout) has no body
  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const { code, message, details } = readError(payload);
    throw new ApiError(response.status, code, message, details);
  }

  return (payload as { data: T }).data;
}
