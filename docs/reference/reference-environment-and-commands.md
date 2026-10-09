# Environment and Commands

## Environment Variables

| Variable              | Use                              | Requirement                                          |
| --------------------- | -------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection            | Required for persistence/migrations                  |
| `INGESTION_API_TOKEN` | Single-user capture bearer token | Required for API capture; example value fails closed |

`.env` is ignored; `.env.example` is committed. Vite loads these two server-side keys for local development. `db:migrate` and `smoke:local` load `.env` if it exists, preserving shell-provided values. Production environment setup is not implemented.

## Commands

| Command                           | Effect                                            |
| --------------------------------- | ------------------------------------------------- |
| `npm ci`                          | Install locked dependencies                       |
| `npm run dev`                     | Loopback Vite server, port 3000                   |
| `npm run build`                   | Build client and SSR artifacts                    |
| `npm test`                        | Unit/HTTP/embedded PostgreSQL integration tests   |
| `npm run typecheck`               | TypeScript validation                             |
| `npm run format` / `format:check` | Prettier formatting/check                         |
| `npm run db:generate`             | Generate Drizzle migration                        |
| `npm run db:migrate`              | Apply migrations using existing shell environment |
| `npm run docs:lint`               | Markdownlint, including agent/config docs         |
| `npm run docs:links`              | Local Markdown target validation                  |
| `npm run docs:check`              | Combined documentation checks                     |

`docker compose up -d` starts the local database. No production start/deploy command is selected yet.

## Local Runtime and CI

| Command                 | Effect                                                     |
| ----------------------- | ---------------------------------------------------------- |
| `npm run local:setup`   | Create private `.env` once with random capture token       |
| `npm run runtime:start` | Start Colima, preferring staged native tools if available  |
| `npm run db:up`         | Start/wait for shared `instagram-library` Compose database |
| `npm run db:stop`       | Stop that Compose project without deleting data            |
| `npm run smoke:local`   | Real PostgreSQL and live API smoke on port 3101            |

The stable Compose project name keeps the database volume consistent across worktrees. CI runs the standard checks and smoke against a disposable PostgreSQL/pgvector service. It uses Node 24, read-only repository permissions, SHA-pinned actions and no production secrets.
