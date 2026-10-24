// frontend/src/pages/Home.tsx
// Public landing page. The sections exist so the navbar anchors work; each one is
// replaced by its real content in the landing branches.

const SECTIONS = [
  { id: 'about', title: 'Sobre mí' },
  { id: 'services', title: 'Servicios' },
  { id: 'coverage', title: 'Cobertura' },
  { id: 'contact', title: 'Contacto' },
];

export function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">ExplorAR AMBIENTE</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Asesoramiento ambiental para proyectos productivos en La Pampa.
        </p>
        <a
          href="#contact"
          className="mt-8 inline-block rounded-lg bg-secondary px-6 py-3 font-heading font-semibold text-primary"
        >
          Solicitar Asesoramiento
        </a>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold">{section.title}</h2>
          <p className="mt-2">Contenido próximamente.</p>
        </section>
      ))}
    </>
  );
}
