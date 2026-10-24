// backend/src/services/inquiry.service.ts
// Business logic for contact inquiries: saves the ones sent from the public form and
// lets the dashboard list them and change their status. The controller turns these
// results into HTTP responses.

import { Types } from 'mongoose';
import { ContactInquiry } from '../models/contact-inquiry.model';
import type { CreateInquiryInput, ListInquiriesQuery } from '../schemas/inquiry.schema';
import type {
  ClientType,
  InquiryStatus,
  IContactInquiry,
  ServiceType,
} from '../types/domain.types';
import { AppError } from '../utils/app-error';

export type InquiryDto = IContactInquiry;

interface InquiryLike {
  _id: { toString(): string };
  clientType: ClientType;
  clientName: string;
  companyOrLocation?: string | null;
  email: string;
  phone?: string | null;
  requestedService: ServiceType;
  message: string;
  privacyAccepted: boolean;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface InquiryPage {
  items: InquiryDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function toInquiryDto(inquiry: InquiryLike): InquiryDto {
  return {
    id: inquiry._id.toString(),
    clientType: inquiry.clientType,
    clientName: inquiry.clientName,
    companyOrLocation: inquiry.companyOrLocation ?? undefined,
    email: inquiry.email,
    phone: inquiry.phone ?? undefined,
    requestedService: inquiry.requestedService,
    message: inquiry.message,
    privacyAccepted: inquiry.privacyAccepted,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt,
  };
}

export async function createInquiry(input: CreateInquiryInput): Promise<void> {
  // The status is never taken from the request: new inquiries start as "pending"
  await ContactInquiry.create(input);
}

export async function listInquiries({
  status,
  page,
  limit,
}: ListInquiriesQuery): Promise<InquiryPage> {
  const filter = status ? { status } : {};

  const [inquiries, total] = await Promise.all([
    ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContactInquiry.countDocuments(filter),
  ]);

  return {
    items: inquiries.map(toInquiryDto),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<InquiryDto> {
  const notFound = new AppError(404, 'INQUIRY_NOT_FOUND', 'Inquiry not found');

  // A malformed id is treated like a missing inquiry
  if (!Types.ObjectId.isValid(id)) throw notFound;

  const inquiry = await ContactInquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
  if (!inquiry) throw notFound;

  return toInquiryDto(inquiry);
}
