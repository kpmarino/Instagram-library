# Foundation verification

Verified 2026-10-08 in the separate `codex/tanstack-foundation` worktree with sandboxed development commands.

- `npm test`: 16 tests across domain validation, HTTP boundary and embedded PostgreSQL integration.
- Migration runs with pgvector enabled and can be rerun without reapplying schema.
- Authenticated HTTP capture persists to PostgreSQL through the real ingestion service; duplicate capture returns the same ID.
- Concurrent duplicate saves produce exactly one item, preserving user notes/title.
- Relationships and cascade deletion behave as expected.
- `npm run typecheck`, `npm run build` and `npm run format:check`: passed.
- `npm audit`: zero vulnerabilities after overriding the obsolete transitive esbuild dependency used by Drizzle tooling. Migration generation was rerun successfully with the override.
- Live development server: `/` renders in the Codex in-app browser at desktop and 768x1024 iPad Mini viewport; headings/body fit without clipping.
- Live `POST /api/v1/items` without server configuration returns 503 with a stable JSON error.
- Generated client assets contain no `DATABASE_URL`, `INGESTION_API_TOKEN` or PostgreSQL connection-string references.

The local Docker daemon is stopped. Real PostgreSQL container smoke testing and production hosting/runtime configuration remain follow-up verification. PGlite runs embedded PostgreSQL with pgvector, not the local Docker image. Rich UI, login, PWA, media retrieval, workers, S3 operations and enrichment remain outside this foundation.
