# Project guidance

Use a separate Git worktree for implementation. Keep sandboxing enabled and make local commits; GitHub setup is a later user-directed step.

Keep source-independent domain logic outside TanStack route files. Use PostgreSQL with Drizzle migrations and S3-compatible storage for media. Do not implement Instagram scraping or AI enrichment without expanding the agreed scope. Do not expose server credentials in client bundles.

Run `npm test`, `npm run typecheck`, and `npm run build` for functional changes. Keep migrations and architecture docs aligned with schema changes. Preserve user metadata on duplicate ingestion.
