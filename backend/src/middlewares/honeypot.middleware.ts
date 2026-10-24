// backend/src/middlewares/honeypot.middleware.ts
// Anti-spam trap for the public contact form. The form includes an extra field that
// people never see (hidden with CSS) but bots fill in. When it arrives with content,
// the request is answered as if it had worked and nothing is saved, so the bot
// gets no signal to adapt to.

import type { RequestHandler } from 'express';

// The frontend form must render an input with this name, hidden from people
export const HONEYPOT_FIELD = 'website';

export const honeypot: RequestHandler = (req, res, next) => {
  const body: unknown = req.body;
  const trap =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)[HONEYPOT_FIELD]
      : undefined;

  if (typeof trap === 'string' && trap.trim() !== '') {
    res.status(201).json({ success: true, data: { received: true } });
    return;
  }

  next();
};
