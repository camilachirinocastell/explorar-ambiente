// backend/src/routes/health.routes.ts
// Health check route. Uptime monitors and the deployment platform call it to
// know the API is alive; it does not touch the database.

import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
