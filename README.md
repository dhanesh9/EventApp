# PIN-Kings EventApp

PIN-Kings is a platform for discovering and organizing events led by top community leaders, personal trainers, coaches, and creators. The application features a Next.js web frontend and a FastAPI backend that will evolve into a full event discovery and organizer collaboration suite.

## Monorepo Layout

- `apps/web`: Next.js frontend for event discovery and organizer management.
- `apps/api`: FastAPI backend API with SQLAlchemy and Alembic for migrations.
- `packages/openapi-client`: Generated TypeScript client for API interactions.
- `infra`: Infrastructure and deployment tooling.
- `.github/workflows`: Continuous integration workflows.

## Getting Started

The project is still in its earliest scaffolding stage. To run the two applications locally:

1. **API**
   ```bash
   cd apps/api
   pip install -e .
   uvicorn app.main:app --reload
   ```
   This starts the FastAPI server at http://localhost:8000 with a `/health` endpoint returning `{"status": "ok"}`.

2. **Web**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   The development server will be available at http://localhost:3000 showing the "PIN-Kings EventApp running" landing page.

## Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Database**: PostgreSQL (to be integrated)
- **Cache/Queue**: Redis (to be integrated)
- **Testing**: Jest & React Testing Library (web), Pytest (API)

## Status

This repository currently contains the initial scaffolding for the platform. Additional services and tooling such as database containers will be introduced in future iterations.
