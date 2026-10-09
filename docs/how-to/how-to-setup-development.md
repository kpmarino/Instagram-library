# Set Up Development

## Prerequisites

Node 24, npm and a running Docker daemon. Work from the separate Git worktree, with dependencies and configuration installed. Ports 3000 and 5432 must be free.

## Install and Configure

```bash
npm ci
npm run local:setup
```

`local:setup` creates a mode-600 `.env` with a random token and preserves existing configuration. Keep the file untracked and never prefix secrets with `VITE_`. The default database URL matches the local Compose credentials; these credentials are for local development only.

## Start the Database and Apply Migrations

```bash
npm run db:up
docker compose -p instagram-library ps
npm run db:migrate
npm run smoke:local
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

## Docker Runtime on This Mac

The system Colima/Lima binaries are Intel and cannot start Lima under Rosetta on this ARM64 Mac. Official native Colima 0.10.3/Lima 2.2.1 binaries have been staged in ignored `.local-tools/colima-lima/` for this checkout. `npm run runtime:start` uses them when available, otherwise the installed `colima` command. The existing Colima profile and system-installed tools were preserved.

These local tools are not committed or distributed. A fresh checkout needs a compatible Docker runtime; install native tools separately if needed. Docker remains running for local testing.

## Live Smoke Test

`npm run smoke:local` verifies migrations twice, vector operations, live API auth/validation, inserts, duplicate handling and SQL persistence. It starts its own loopback server on port 3101, then removes its uniquely named disposable item and stops that server. Keep port 3101 free. It does not remove user items or the database volume.
