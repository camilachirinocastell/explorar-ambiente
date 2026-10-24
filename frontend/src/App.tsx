// frontend/src/App.tsx
// Root component of the app. For now it shows a placeholder to check that Vite,
// React, Tailwind and the design tokens work together; the routes replace it.

export function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-4xl font-bold">ExplorAR</h1>
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary-light">
        Ambiente
      </p>
      <button
        type="button"
        className="rounded-lg bg-secondary px-5 py-2 font-heading font-semibold text-primary"
      >
        Solicitar Asesoramiento
      </button>
    </main>
  );
}
