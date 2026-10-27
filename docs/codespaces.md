# Codespaces development

Open the repository in its Codespace and use two terminals from the repository
root. The frontend is available on port 5173 and the API docs on port 8000.

## Start PostgreSQL and the API

In the first terminal:

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.lock
cp .env.example .env
```

Edit `backend/.env` to set a local database password in `DATABASE_URL` and use
the same value for `POSTGRES_PASSWORD`. Keep `.env` local; it is ignored by Git.
Then start the disposable development database and API:

```sh
docker compose --env-file .env up -d --wait
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The database listens on loopback port 5432 only. Keep any existing 5432 Codespaces entry private; never make it public.
Forward API port 8000 as private in the Codespaces Ports panel if you want to
open `/docs` directly. The API process logs appear in this terminal.

## Start the frontend

In a second terminal from the repository root:

```sh
npm ci
npm run dev
```

Vite listens on `0.0.0.0:5173` with a fixed port. Its `/api` proxy sends browser
requests to the API on `127.0.0.1:8000`; the browser uses relative `/api/v1/...`
URLs. The proxy allows only the exact Codespaces forwarded host derived from
`CODESPACE_NAME` and `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN`. Keep frontend
and API forwarded ports private. Frontend logs appear in the second terminal.

The development sidebar shows API health and database readiness separately.
These checks confirm service connectivity only. Authentication and
customer/order workflows are not implemented by the foundation.

## Checks

From the repository root, run `npm run check`, `npm test`, and `npm run build`.
From `backend/` with its virtual environment active, run `python -m pip check`,
`ruff check .`, `ruff format --check .`, `pytest -q`, and `alembic upgrade head --sql`. Set `TEST_DATABASE_URL` only to a disposable PostgreSQL database before
running the optional database integration test.
