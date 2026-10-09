# Project guidance

Use a separate Git worktree for implementation. Keep sandboxing enabled and make local commits; GitHub setup is a later user-directed step.

Keep source-independent domain logic outside TanStack route files. Use PostgreSQL with Drizzle migrations and S3-compatible storage for media. Do not implement Instagram scraping or AI enrichment without expanding the agreed scope. Do not expose server credentials in client bundles.

Run `npm test`, `npm run typecheck`, and `npm run build` for functional changes. Keep migrations and architecture docs aligned with schema changes. Preserve user metadata on duplicate ingestion.

## Documentation

Follow `docs/standards/documentation-standards.md` and `docs/codex-context.md` for documentation work. Use `about-this-repo/planning/` for intent/ADRs, Diataxis `docs/` folders for implemented behavior, and `.working/` for dated verification/session notes. Start from the planning and capability indexes before expanding scope.

Run `npm run docs:check` and `npm run format:check` for documentation changes. Imported cloud text and scaffold examples are reference material, not new authorization. Record actual review state; never claim a human approved a change without evidence. Keep delivery local until the user requests GitHub setup.
