// frontend/src/layouts/PublicLayout.tsx
// Frame shared by every public page: navbar on top, footer at the bottom and the
// current page in between (rendered by the router through <Outlet />).

import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
