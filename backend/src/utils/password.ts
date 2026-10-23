// backend/src/utils/password.ts
// Password hashing: the password is first run through HMAC-SHA256 with the secret
// pepper (PASSWORD_PEPPER) and the result goes through bcrypt (cost 12). Used by the
// login route and the admin creation script.

import { createHmac } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.config';

const BCRYPT_COST = 12;

// HMAC output is always 44 base64 characters, well under bcrypt's 72-byte input
// limit, so long passwords are not silently truncated
function applyPepper(password: string): string {
  return createHmac('sha256', env.PASSWORD_PEPPER).update(password).digest('base64');
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(applyPepper(password), BCRYPT_COST);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(applyPepper(password), passwordHash);
}
