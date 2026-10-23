// backend/src/models/user.model.ts
// Mongoose model for the users who can sign in to the private dashboard.
// The password is stored only as a hash (see D24); the auth service is the
// only code that creates or verifies it.

import { model, Schema } from 'mongoose';

import type { IUser } from '../types/domain.types';

// Mongoose manages the id and the timestamps itself, so they are not declared
// in the schema.
type UserAttributes = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

const userSchema = new Schema<UserAttributes>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Excluded from queries by default so it never leaks into a response by
    // accident; the login flow asks for it explicitly with select('+passwordHash').
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'engineer'], required: true },
  },
  { timestamps: true },
);

export const User = model<UserAttributes>('User', userSchema);
