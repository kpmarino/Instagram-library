# Set Up Development

## Prerequisites

Node 24, npm and a running Docker daemon. Work from the separate Git worktree, not the empty `main` checkout. Ports 3000 and 5432 must be free.

## Install and Configure

```bash
npm ci
cp .env.example .env
openssl rand -hex 32
```

Put the generated value in `INGESTION_API_TOKEN` in `.env`. Keep the file untracked and never prefix secrets with `VITE_`. The default database URL matches the local Compose credentials; these credentials are for local development only.

## Start the Database and Apply Migrations

```bash
docker compose up -d
docker compose ps
node --env-file=.env --import tsx scripts/migrate.ts
```

PostgreSQL/pgvector is bound to loopback and data is stored in a named volume. Migration failures must be resolved before testing capture. Do not run `docker compose down -v` on valuable data.

## Run the Application

```bash
npm run dev
```

Visit `http://127.0.0.1:3000`. The page is a foundation status shell. The Vite config explicitly loads server environment values from `.env`; production must receive them through its runtime environment.

## Verify Changes

```bash
npm test
npm run typecheck
npm run build
npm run format:check
npm run docs:check
```

Tests require no Docker and run against embedded PostgreSQL with pgvector. This does not replace real-container or production-host verification.

## Generate a Schema Change

Edit `src/db/schema/index.ts`, then run `npm run db:generate`. Review generated SQL and commit it with the schema and updated references. Apply migrations to a disposable database before applying them to valuable data.
