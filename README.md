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

## Environment variables

Each layer has its own template. Copy `backend/.env.example` to `backend/.env`
and `frontend/.env.example` to `frontend/.env`, then replace the placeholders.
Real `.env` files are ignored by Git and must never be committed.

**Backend**

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign session tokens |
| `PASSWORD_PEPPER` | Secret applied to passwords before hashing; must differ from `JWT_SECRET` |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `RESEND_API_KEY` | API key of the email service used for inquiry notifications |

**Frontend**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API (`/api/v1` in production, proxied by Vercel). Exposed in the browser: never put secrets in `VITE_` variables |

## Repository structure

    .
    ├── backend/
    │   └── .env.example       # Backend environment variables template
    ├── frontend/
    │   └── .env.example       # Frontend environment variables template
    ├── .gitignore
    ├── LICENSE
    ├── README.md
    ├── package.json           # Root package and pinned pnpm version
    └── pnpm-workspace.yaml    # Workspace packages and pnpm security settings

The `backend/` (Express API) and `frontend/` (React app) workspaces currently
only hold their environment variable templates; their source code will be added
as the project grows.

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
