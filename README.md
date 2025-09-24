# PIN-Kings EventApp

PIN-Kings ("PIN" stands for People in Neighborhoods) is a platform for discovering and organizing events led by top community leaders, personal trainers, coaches, and creators. The monorepo contains a Next.js web frontend and a FastAPI backend that will evolve into a full event discovery and organizer collaboration suite.

## Monorepo Layout

- `apps/web`: Next.js frontend for event discovery and organizer management.
- `apps/api`: FastAPI backend API with SQLAlchemy and Alembic for migrations.
- `packages/openapi-client`: Generated TypeScript client for API interactions.
- `infra`: Infrastructure and deployment tooling.
- `.github/workflows`: Continuous integration workflows.

## Getting Started

The project is still in its earliest scaffolding stage. Two options are available for local development.

### 1. Docker Compose (recommended)

```bash
docker compose up --build
```

This will launch the stack with the following services:

- **db**: PostgreSQL 15 accessible at `localhost:5432` with credentials `postgres/postgres`.
- **redis**: Redis 7 accessible at `localhost:6379`.
- **api**: FastAPI app available at `http://localhost:8080/health` returning `{ "status": "ok" }`.
- **web**: Next.js app available at `http://localhost:3000` showing the "PIN-Kings EventApp running" landing page.

Hot reloading is enabled by mounting the source directories into the containers, so editing files locally will update the running services.

### 2. Manual startup (without Docker)

You can still run the applications directly during the scaffold stage:

1. **API**
   ```bash
   cd apps/api
   pip install -e .
   uvicorn app.main:app --reload --port 8080
   ```

2. **Web**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

## Testing

- **API**: `pip install -e .[dev] && pytest`
- **Web**: `npm run test`

## Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Database**: PostgreSQL with PostGIS in the future
- **Cache/Queue**: Redis
- **Testing**: Jest & React Testing Library (web), Pytest (API)

## Status

This repository currently contains the initial scaffolding for the platform. Additional services and tooling such as background jobs and sponsor outreach features will be introduced in future iterations.
