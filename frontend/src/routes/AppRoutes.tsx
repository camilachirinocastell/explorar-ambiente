// frontend/src/routes/AppRoutes.tsx
// Route table of the app. The public pages share PublicLayout; everything under /admin
// requires a session (ProtectedRoute) and uses AdminLayout.

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminInquiries } from '../pages/AdminInquiries';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { useAuthStore } from '../store/authStore';

export function AppRoutes() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  // Ask the backend once on load whether the session cookie is still valid
  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminInquiries />} />
        </Route>
      </Route>
    </Routes>
  );
}
