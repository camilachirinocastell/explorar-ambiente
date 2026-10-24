// frontend/src/pages/NotFound.tsx
// Page shown for any address the router does not know.

import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-2">La dirección que buscás no existe o fue movida.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-secondary px-5 py-2 font-heading font-semibold text-primary"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
