# PIN-Kings EventApp

PIN-Kings is a platform for discovering and organizing events led by top community leaders, personal trainers, coaches, and creators. The application features a Next.js web frontend and a FastAPI backend, orchestrated through Docker Compose with PostgreSQL and Redis services.

## Monorepo Layout

- `apps/web`: Next.js frontend for event discovery and organizer management.
- `apps/api`: FastAPI backend API with SQLAlchemy and Alembic for migrations.
- `packages/openapi-client`: Generated TypeScript client for API interactions.
- `infra`: Infrastructure and deployment tooling such as Docker Compose.
- `.github/workflows`: Continuous integration workflows.

## Getting Started

1. Ensure Docker and Docker Compose are installed.
2. Copy `.env.example` files (to be added) and configure environment variables as needed.
3. Run the stack locally with:

```bash
docker compose up --build
```

The web app will be available at http://localhost:3000 and the API at http://localhost:8080.

## Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Infrastructure**: Docker Compose
- **Testing**: Jest & React Testing Library (web), Pytest (API)

## Status

This repository currently contains the initial scaffolding for the platform.
