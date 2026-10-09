# Environment and Commands

## Environment Variables

| Variable              | Use                              | Requirement                                          |
| --------------------- | -------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection            | Required for persistence/migrations                  |
| `INGESTION_API_TOKEN` | Single-user capture bearer token | Required for API capture; example value fails closed |

`.env` is ignored; `.env.example` is committed. Vite loads these two server-side keys for local development. `scripts/migrate.ts` reads shell environment; use Node's `--env-file=.env` flag locally. Production environment setup is not implemented.

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
