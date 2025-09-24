# PIN-Kings EventApp

PIN-Kings is a platform for discovering and organizing events led by top community leaders, personal trainers, coaches, and creators. The application features a Next.js web frontend and a FastAPI backend.

## Monorepo Layout

- `apps/web`: Next.js frontend for event discovery and organizer management.
- `apps/api`: FastAPI backend API with SQLAlchemy and Alembic for migrations.
- `packages/openapi-client`: Generated TypeScript client for API interactions.
- `infra`: Infrastructure and deployment tooling such as Docker Compose.
- `.github/workflows`: Continuous integration workflows.

## Getting Started (Local Development)

Running the stack no longer requires Docker. Each application can be started locally with the usual dev tooling.

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+
- [uvicorn](https://www.uvicorn.org/) (installed automatically with the API dependencies)

### Install dependencies

```bash
# Install frontend dependencies
cd apps/web
npm install

# (Optional) install backend dependencies in a virtualenv
cd ../../apps/api
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
```

### Run the applications

From the repository root you can start the web app with a single command:

```bash
npm run dev
```

This forwards to `apps/web` and starts the Next.js dev server at http://localhost:3000.

To run the FastAPI backend locally:

```bash
cd apps/api
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000 and exposes a `/health` endpoint.

## Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Database**: PostgreSQL (planned)
- **Cache/Queue**: Redis (planned)
- **Infrastructure**: Docker Compose (for future containerized deployments)
- **Testing**: Jest & React Testing Library (web), Pytest (API)

## Status

This repository currently contains the initial scaffolding for the platform.
