// backend/src/server.ts
// Process entry point. Importing the env config first guarantees the server
// never starts with an invalid configuration.

import { env } from './config/env.config';

console.log(`Environment OK (${env.NODE_ENV}), port ${env.PORT}`);
