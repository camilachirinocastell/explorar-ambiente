// frontend/vite.config.ts
// Vite configuration: React support and the Tailwind CSS plugin. The build output
// goes to frontend/dist, which Vercel serves.

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
