// Layout of the admin panel: a header with the logged-in user and the logout button,
// and the page content below. ProtectedRoute already guarantees there is a session.

import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // The store clears the local session even when the request fails, so ProtectedRoute
      // redirects to /login anyway; there is nothing else to show here
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <header className="bg-primary text-bg-main">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-heading text-lg font-bold">ExplorAR AMBIENTE · Panel</span>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.fullName}</span>
            <Button variant="outline-light" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Saliendo…' : 'Cerrar sesión'}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
