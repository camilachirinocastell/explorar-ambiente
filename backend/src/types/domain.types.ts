// backend/src/types/domain.types.ts
// Shared domain types for the backend. Models, schemas and services import
// their entity shapes from here so each concept is defined only once.

export type UserRole = 'admin' | 'engineer';

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
