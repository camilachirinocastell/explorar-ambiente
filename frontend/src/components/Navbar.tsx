// frontend/src/components/Navbar.tsx
// Sticky top bar of the public site: brand, links to the landing sections and the
// private access button. On small screens the links fold into a toggleable menu.

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Plain anchors with "/#id" work from any page: on the home page they scroll to the
// section, elsewhere they go to the home page first
const NAV_LINKS = [
  { href: '/#about', label: 'Sobre mí' },
  { href: '/#services', label: 'Servicios' },
  { href: '/#coverage', label: 'Cobertura' },
  { href: '/#contact', label: 'Contacto' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-bg-main shadow-sm">
      <nav
        aria-label="Principal"
        className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
      >
        <Link to="/" onClick={closeMenu} className="flex flex-col leading-none">
          <span className="font-heading text-xl font-bold">ExplorAR</span>
          <span className="font-heading text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-secondary">
            Ambiente
          </span>
        </Link>

        <button
          type="button"
          className="rounded p-2 md:hidden"
          aria-expanded={isOpen}
          aria-controls="main-menu"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {isOpen ? '✕' : '☰'}
          </span>
        </button>

        <ul
          id="main-menu"
          className={`${isOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-1 bg-primary px-4 pb-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:p-0`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={closeMenu}
                className="block py-2 font-medium hover:text-secondary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/login"
              onClick={closeMenu}
              className="block rounded-lg border border-secondary px-4 py-2 text-center font-heading text-sm font-semibold text-secondary hover:bg-secondary hover:text-primary"
            >
              Acceso Privado
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
