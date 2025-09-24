# Infrastructure

The `infra` directory will house infrastructure-as-code, environment configuration, and deployment tooling as the platform matures. For now, the primary orchestration asset lives at the repository root as `docker-compose.yml`, which wires together PostgreSQL, Redis, the FastAPI service, and the Next.js frontend for local development.

Future additions will include infrastructure automation, migrations management, and observability tooling.
