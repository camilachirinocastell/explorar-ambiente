// Landing page of the admin panel. For now it only confirms the session works; the list
// of inquiries replaces this content in the next branch (feature/admin-inquiries).

import { useAuthStore } from '../store/authStore';

export function AdminHome() {
  const user = useAuthStore((state) => state.user);

  return (
    <section>
      <h1 className="font-heading text-3xl font-bold text-primary">Panel de administración</h1>
      <p className="mt-2 text-text-main">
        Hola, {user?.fullName}. Acá vas a ver las consultas recibidas desde el formulario.
      </p>
    </section>
  );
}
