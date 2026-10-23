// backend/src/services/auth.service.ts
// Authentication business logic: creates users, checks credentials and looks up the
// signed-in user. It is the only code that creates or verifies password hashes; the
// controller turns its results into HTTP responses.

import { randomUUID } from 'node:crypto';
import { User } from '../models/user.model';
import type { UserRole } from '../types/domain.types';
import { AppError } from '../utils/app-error';
import { signSessionToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface UserLike {
  _id: { toString(): string };
  fullName: string;
  email: string;
  role: UserRole;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

function toPublicUser(user: UserLike): PublicUser {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

// When the email does not exist we still run one hash comparison against this value,
// so the response time does not reveal which emails are registered
let dummyHashPromise: Promise<string> | undefined;
function getDummyHash(): Promise<string> {
  dummyHashPromise ??= hashPassword(randomUUID());
  return dummyHashPromise;
}

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    role: input.role,
  });
  return toPublicUser(user);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: PublicUser }> {
  const user = await User.findOne({ email }).select('+passwordHash');
  const passwordHash = user?.passwordHash ?? (await getDummyHash());
  const isValid = await verifyPassword(password, passwordHash);

  // Same message for "unknown email" and "wrong password"
  if (!user || !isValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const publicUser = toPublicUser(user);
  const token = signSessionToken({ userId: publicUser.id, role: publicUser.role });
  return { token, user: publicUser };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);

  // The token is valid but the user was deleted since it was issued
  if (!user) {
    throw new AppError(401, 'INVALID_SESSION', 'Invalid or expired session');
  }

  return toPublicUser(user);
}
