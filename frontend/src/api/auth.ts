// Authentication API calls: login, logout and current session lookup.
// The session itself lives in an httpOnly cookie set by the backend,
// so the frontend never sees or stores the token.

import { apiRequest } from './client';

export type UserRole = 'admin' | 'engineer';

// Mirrors the PublicUser shape returned by the backend (never includes the password hash)
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginValues {
  email: string;
  password: string;
}

interface UserResponse {
  user: AuthUser;
}

export async function login(values: LoginValues): Promise<AuthUser> {
  const data = await apiRequest<UserResponse>('/auth/login', {
    method: 'POST',
    body: values,
  });
  return data.user;
}

export async function logout(): Promise<void> {
  await apiRequest<void>('/auth/logout', { method: 'POST' });
}

// Throws ApiError with status 401 when there is no valid session
export async function fetchCurrentUser(): Promise<AuthUser> {
  const data = await apiRequest<UserResponse>('/auth/me');
  return data.user;
}
