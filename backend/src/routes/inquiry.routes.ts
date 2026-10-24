// backend/src/routes/inquiry.routes.ts
// Inquiry routes, mounted under /api/v1/inquiries: the public contact form (with a
// strict rate limit and the honeypot trap) and the private dashboard routes.

import { Router } from 'express';
import {
  createInquiry,
  listInquiries,
  updateInquiryStatus,
} from '../controllers/inquiry.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { honeypot } from '../middlewares/honeypot.middleware';
import { inquiryLimiter } from '../middlewares/rate-limiter.middleware';

export const inquiryRouter = Router();

inquiryRouter.post('/', inquiryLimiter, honeypot, createInquiry);
inquiryRouter.get('/', requireAuth, listInquiries);
inquiryRouter.patch('/:id', requireAuth, updateInquiryStatus);
