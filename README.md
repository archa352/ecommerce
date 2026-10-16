# TWS E-Commerce API

Multi-tenant e-commerce SaaS backend. FastAPI, async SQLAlchemy on PostgreSQL,
Redis for caching and rate limiting.

## Quick start

```bash
cp .env.example .env                 # then edit the JWT secrets
python -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements-dev.txt

make dev
```

To run the storefront and admin frontend alongside the API:

```bash
npm install
npm run dev:all
```

API docs: <http://localhost:58000/docs>. To create the Zeen tenant and its admin
user, run the seed once:

```bash
docker compose exec api python -m app.commands.seed
```

## Development commands

Run from the repository root — no need to `cd` anywhere.

| Command | What it does |
|---|---|
| `make dev` | Starts Postgres, Redis and the API, waits for health, applies migrations |
| `npm run dev:storefront` | Starts the storefront frontend at http://localhost:3000 |
| `npm run dev:admin` | Starts the admin frontend at http://localhost:5173 |
| `npm run dev:all` | Starts the storefront + admin frontend together |
| `make test` | Runs the full test suite |
| `make lint` | Runs `ruff` static checks |
| `make check` | Full gate: compile, lint, migration drift (`alembic check`), tests |

