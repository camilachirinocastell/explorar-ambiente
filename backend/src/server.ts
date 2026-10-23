// backend/src/server.ts
// Backend entry point. For now it validates the environment, opens the MongoDB
// connection and closes it cleanly on shutdown; the HTTP server is added later.

import { connectDatabase, disconnectDatabase } from './config/db.config';
import { env } from './config/env.config';

async function main(): Promise<void> {
  console.log(`Environment OK (${env.NODE_ENV}), port ${env.PORT}`);

  await connectDatabase();

  const shutdown = async (): Promise<void> => {
    await disconnectDatabase();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

main().catch((error: unknown) => {
  console.error('Failed to start the backend:', error);
  process.exit(1);
});
