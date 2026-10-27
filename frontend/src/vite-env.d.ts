// frontend/src/vite-env.d.ts
// Types for the environment variables Vite exposes to the browser (the VITE_ ones),
// so import.meta.env.VITE_API_URL is a string and not "any".

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
