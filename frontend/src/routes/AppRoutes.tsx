// frontend/src/routes/AppRoutes.tsx
// Route table of the app. The public pages share PublicLayout; the login page and
// the protected /admin routes are added with the admin branches.

import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
