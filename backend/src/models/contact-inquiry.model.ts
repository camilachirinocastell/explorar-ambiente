// backend/src/models/contact-inquiry.model.ts
// Mongoose model for the inquiries sent from the public contact form. The inquiry
// routes create them (public) and the admin dashboard lists them and changes their
// status (private).

import { model, Schema } from 'mongoose';

import type { IContactInquiry } from '../types/domain.types';
import { CLIENT_TYPES, INQUIRY_STATUSES, SERVICE_TYPES } from '../types/domain.types';

// Mongoose manages the id and the timestamps itself, so they are not declared
// in the schema.
type ContactInquiryAttributes = Omit<IContactInquiry, 'id' | 'createdAt' | 'updatedAt'>;

const contactInquirySchema = new Schema<ContactInquiryAttributes>(
  {
    clientType: { type: String, enum: CLIENT_TYPES, required: true },
    clientName: { type: String, required: true, trim: true, maxlength: 100 },
    companyOrLocation: { type: String, trim: true, maxlength: 150 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    requestedService: { type: String, enum: SERVICE_TYPES, required: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    // The privacy policy must be accepted to send the form (Ley 25.326)
    privacyAccepted: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value: boolean) => value === true,
        message: 'The privacy policy must be accepted',
      },
    },
    status: { type: String, enum: INQUIRY_STATUSES, default: 'pending' },
  },
  { timestamps: true },
);

// The dashboard lists the newest inquiries first
contactInquirySchema.index({ createdAt: -1 });

export const ContactInquiry = model<ContactInquiryAttributes>(
  'ContactInquiry',
  contactInquirySchema,
);
