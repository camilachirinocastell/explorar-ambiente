// backend/src/server.ts
// Backend entry point. It validates the environment, opens the MongoDB connection
// and starts the HTTP server built in app.ts. On shutdown it stops accepting
// requests and then closes the database connection.

import { app } from './app';
import { connectDatabase, disconnectDatabase } from './config/db.config';
import { env } from './config/env.config';

async function main(): Promise<void> {
  console.log(`Environment OK (${env.NODE_ENV}), port ${env.PORT}`);

  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });

  const shutdown = (): void => {
    server.close(() => {
      void disconnectDatabase().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error: unknown) => {
  console.error('Failed to start the backend:', error);
  process.exit(1);
});
