# ExplorAR AMBIENTE

Fullstack web platform for ExplorAR AMBIENTE, an environmental consultancy in
La Pampa, Argentina, led by Macarena Vicciatti, Natural Resources and
Environmental Engineer. It combines a public landing page that captures client
inquiries with a private admin dashboard for managing inquiries, environmental
projects and inspection reports.

## Overview

- **Public landing page:** presents the consultancy and its services, shows the
  geographic coverage and collects inquiries through a contact form.
- **Private admin dashboard:** JWT authentication over an `httpOnly` cookie, where
  the consultant manages inquiries, projects and inspection reports.

## Tech stack

Planned stack, all in TypeScript:

- **Monorepo:** pnpm workspaces
- **Frontend:** React, Vite, Tailwind CSS, React Router, Zustand
- **Backend:** Node.js, Express, MongoDB (Mongoose), Zod
- **Quality:** ESLint, Prettier, Husky, commitlint, GitHub Actions
- **Testing:** Vitest, Supertest

## Project status

🚧 In development. The repository foundations are being set up; there is
nothing to run yet.

## Prerequisites

- Node.js 22 or higher
- pnpm 11 (the exact version is pinned in `package.json` through the
  `packageManager` field)

## Repository structure

    .
    ├── .gitignore
    ├── LICENSE
    ├── README.md
    ├── package.json           # Root package and pinned pnpm version
    └── pnpm-workspace.yaml    # Workspace packages and pnpm security settings

The `backend/` (Express API) and `frontend/` (React app) workspaces will be
added as the project grows.

## Git workflow

The project follows Git Flow adapted to a monorepo:

- `main` holds stable, released code; `develop` is the integration branch.
  Both are protected with GitHub rulesets: changes only arrive through pull
  requests.
- Work happens on short-lived branches created from `develop`
  (`feature/*`, `fix/*`, `chore/*`, `docs/*`, `test/*`, `ci/*`), one objective
  per branch, merged with squash.
- Releases go through `release/*` branches and are merged into `main` with a
  merge commit and a version tag.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
  with the layer as scope, for example `feat(backend): add login endpoint`.

## License

Released under the [MIT License](LICENSE).

## Author

Camila Chirino Castell —
💻 Portfolio: [camilachirinocastell-portfolio.netlify.app](https://camilachirinocastell-portfolio.netlify.app)
🐙 GitHub: [github.com/camilachirinocastell](https://github.com/camilachirinocastell)
👤 LinkedIn: [www.linkedin.com/in/camila-chirino-castell](https://www.linkedin.com/in/camila-chirino-castell)
