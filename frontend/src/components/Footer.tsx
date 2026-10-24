// frontend/src/components/Footer.tsx
// Footer of the public site: brand, professional credentials and copyright. The
// contact data and the privacy policy link are added with their sections.

export function Footer() {
  return (
    <footer className="bg-primary text-bg-main">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="font-heading font-semibold">ExplorAR AMBIENTE</p>
        <p className="mt-1">
          Ing. en Recursos Naturales y Medio Ambiente Macarena Vicciatti · Matrícula Profesional N°
          416
        </p>
        <p className="mt-4 text-xs opacity-80">© {new Date().getFullYear()} ExplorAR AMBIENTE</p>
      </div>
    </footer>
  );
}
