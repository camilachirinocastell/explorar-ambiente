// Guard for the admin routes. While the app is still asking the backend whether a session
// exists it shows a short loading message (redirecting right away would bounce a logged-in
// admin to the login page on every reload). Without a session it sends the visitor to /login.

import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === 'checking') {
    return (
      <p role="status" className="px-4 py-20 text-center text-text-main">
        Verificando sesión…
      </p>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
