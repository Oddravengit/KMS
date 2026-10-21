# ODD RAVEN backend — Day 1

FastAPI, Pydantic settings, SQLAlchemy 2 sessions and Alembic migrations for PostgreSQL.
Python 3.11+ is required; CI uses Python 3.12 and PostgreSQL 16.

## Run locally

From `backend/`:

```sh
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# Linux/macOS: source .venv/bin/activate
python -m pip install -r requirements-dev.lock
# Copy .env.example to .env and set your own database password.
# Set POSTGRES_PASSWORD in the shell to the same password before starting Compose.
docker compose up -d --wait
alembic upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The sample `kms` password is for local setup only. `.env` is ignored. PostgreSQL
is bound to loopback and uses a persistent volume. Normal startup never creates
business tables or runs migrations automatically.

## Frontend contract

- `GET /api/v1/health` → HTTP 200 and exactly
  `{"status":"ok","service":"odd-raven-api","version":"v1"}`.
- `GET /api/v1/ready` performs `SELECT 1` against PostgreSQL. Returns HTTP 200
  with `{"status":"ok","database":"ok"}` or HTTP 503 with
  `{"status":"unavailable","database":"unavailable"}`. Liveness stays available
  when PostgreSQL is offline. Readiness verifies connectivity, not schema currency;
  run migrations before starting the application.
- OpenAPI: `/openapi.json`; interactive docs: `/docs`.
- Default permitted browser origin: `http://localhost:5173`. Configure
  `CORS_ORIGINS` as a JSON array in `.env` for other frontend origins.

Future route handlers use `Annotated[Session, Depends(get_session)]` from
`app.db`. A session closes on every request; writes must explicitly commit.
Unhandled errors return a generic HTTP 500 response. Logs include method, path,
status and duration, excluding query strings and request bodies.

## Checks

```sh
python -m pip check
ruff check .
ruff format --check .
pytest -q
alembic upgrade head --sql
```

Set `TEST_DATABASE_URL` to a **disposable** PostgreSQL database to enable the
integration test. It upgrades the migration baseline, checks real readiness and
migration version, then downgrades and upgrades. Without that variable, only
this integration test is skipped. Never point it at a customer database.

`requirements-dev.lock` records the exact dependency versions used for validation.
`pyproject.toml` contains the supported dependency ranges for packaging.
CI repeats lint, format, tests, dependency checks and migration SQL generation,
with PostgreSQL 16 available. The initial migration establishes the Alembic
baseline only; business models and authentication are subsequent work.

## Scope and handoff

Worker 2 branch: `feat/day01-backend-foundation`, based on the initial `main`.
Changes live in `backend/` and the backend workflow. The existing root README,
Worker 1 frontend branch and Figma are preserved. Review the backend PR before
integration into `develop`; no merge to `main` is performed.
