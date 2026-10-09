// eslint.config.mjs
// ESLint rules for the whole monorepo: recommended JavaScript and TypeScript
// rules, with the rules that would conflict with Prettier turned off.

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/dist/', '**/build/', '**/coverage/']),
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended, prettier],
  },
]);