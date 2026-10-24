// backend/src/controllers/inquiry.controller.ts
// HTTP layer of the inquiries: validates the request with the Zod schemas, calls the
// inquiry service and builds the response. Errors thrown here reach the global
// error handler.

import type { RequestHandler } from 'express';
import {
  createInquirySchema,
  listInquiriesQuerySchema,
  updateInquiryStatusSchema,
} from '../schemas/inquiry.schema';
import * as inquiryService from '../services/inquiry.service';
import { AppError } from '../utils/app-error';

// Public: the answer only confirms reception and never echoes the saved data
export const createInquiry: RequestHandler = async (req, res) => {
  const input = createInquirySchema.parse(req.body);
  await inquiryService.createInquiry(input);

  res.status(201).json({ success: true, data: { received: true } });
};

export const listInquiries: RequestHandler = async (req, res) => {
  const query = listInquiriesQuerySchema.parse(req.query);
  const result = await inquiryService.listInquiries(query);

  res.json({ success: true, data: result });
};

export const updateInquiryStatus: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (typeof id !== 'string') {
    throw new AppError(404, 'INQUIRY_NOT_FOUND', 'Inquiry not found');
  }

  const { status } = updateInquiryStatusSchema.parse(req.body);
  const inquiry = await inquiryService.updateInquiryStatus(id, status);

  res.json({ success: true, data: { inquiry } });
};
