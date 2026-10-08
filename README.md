# Personal Library

TanStack Start + React + TypeScript foundation for a personal saved-content archive. Instagram is the first recognized URL source; the domain is a `SavedItem`, rather than an Instagram post.

## Local setup

Use Node 24 (see `.nvmrc`) and npm.

```sh
npm ci
cp .env.example .env
# Replace INGESTION_API_TOKEN with a long random token.
docker compose up -d
node --env-file=.env --import tsx scripts/migrate.ts
npm run dev
```

Open http://127.0.0.1:3000. Vite loads `.env` for local server code. The migration script requires environment variables from the shell or the explicit `--env-file` flag above. The Docker database is bound to loopback; its sample credentials are for local development only.

```sh
npm test
npm run typecheck
npm run build
npm run format:check
npm run db:generate
```

Tests run the committed migration against embedded PostgreSQL (PGlite) with pgvector, then verify persistence, duplicate races, relationships, cascade deletion and HTTP validation. They require no external database. A real PostgreSQL/pgvector container remains the runtime target; test the container before deployment.

## Ingestion

`POST /api/v1/items` requires `Authorization: Bearer <INGESTION_API_TOKEN>` and JSON. The token is server-only; do not add it to a `VITE_` variable or client UI. Generate one with `openssl rand -hex 32` and put it in your local `.env`.

```json
{
  "url": "https://www.instagram.com/reel/ABC123/?igsh=tracking",
  "title": "Try this recipe",
  "notes": "Use chicken stock",
  "savedAt": "2026-10-01T12:00:00Z"
}
```

All fields except `url` are optional. New items return `201` with `{ "item": ..., "created": true }`. Duplicate URLs return the existing item with `200` and `created: false`, preserving existing title, notes and save date. The API captures URLs only: it does not fetch remote content or archive media.

Errors: `400` malformed JSON/input, `401` bad token, `413` body above 32 KiB, `415` non-JSON content type, `503` missing configuration or unavailable persistence. Responses use `Cache-Control: no-store`. Unknown JSON fields are rejected.

## Project map

- `src/routes`: TanStack shell and versioned server route.
- `src/domain/items`: validation and URL normalization, independent of TanStack.
- `src/services/ingestion`: persistence orchestration and HTTP boundary.
- `src/db/schema`: items, assets, tags, collections, joins and metadata provenance.
- `src/db/migrations`: versioned SQL and Drizzle snapshots, including pgvector extension.
- `tests`: domain, HTTP and PostgreSQL integration tests.
- [Architecture](docs/architecture/README.md): scope, decisions and next steps.

This is the agreed initial foundation, not the full v0.1 product. Login, interactive library/capture UI, PWA/offline behavior, Shortcut setup, bulk imports, search, media workers, S3 client and AI enrichment are subsequent work. No Instagram scraping or external AI calls are implemented.

GitHub and deployment setup are deliberately deferred. Work is committed locally on `codex/tanstack-foundation` in the separate `.worktrees/tanstack-foundation` checkout. Git operations may need scoped permission because the Codex sandbox protects `.git`; development stays sandboxed.
