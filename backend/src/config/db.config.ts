// backend/src/config/db.config.ts
// Opens and closes the MongoDB connection through Mongoose. It reads the
// connection string from the validated environment (env.config.ts) and is
// called from server.ts before the HTTP server starts listening.

import mongoose from 'mongoose';

import { env } from './env.config';

// Fail fast when Atlas is unreachable (wrong credentials, IP not allowed)
// instead of waiting for Mongoose's default 30 seconds.
const SERVER_SELECTION_TIMEOUT_MS = 10_000;

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  await mongoose.connect(env.DATABASE_URL, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });

  console.log(`MongoDB connected (${mongoose.connection.name})`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
