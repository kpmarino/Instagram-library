# Architecture

## Initial foundation

The first implementation establishes TanStack Start with React/TypeScript, PostgreSQL/pgvector and Drizzle migrations, source-independent saved items, archived-asset metadata, tags, collections, custom metadata provenance, and authenticated `POST /api/v1/items`. It includes a minimal responsive shell, meaningful tests and these decisions. Rich UI and retrieval/enrichment adapters are deferred.

## Boundaries

```text
External capture / future Apple Shortcut
  -> POST /api/v1/items (server route, bearer authentication)
  -> input validation / canonical URL
  -> ingestion service
  -> Drizzle -> PostgreSQL

Future archive worker -> S3-compatible storage
                     -> asset metadata in PostgreSQL
```

Neither normalization nor saving makes outbound requests. Original URL is retained as provenance. Canonical URL has a unique constraint so concurrent ingestion cannot create duplicate records. Repeat capture is a read of the original record, not a metadata update. Future mutations should have explicit semantics.

The initial deployment model is single user. A server-side ingestion token gates the only data endpoint. This is not a full user session/login system. Add session auth and CSRF protection before app-internal mutations or exposing a private library UI. Implement token rotation/management, rate limits and a request-size limit at the reverse proxy before public deployment. Do not store the API token in browser code.

## Models

`SavedItem` stores URL provenance, source/source ID, optional original content fields, user title/notes, source metadata, save/create timestamps and archive status. `ArchivedAsset` references an item and identifies an S3-compatible bucket/key, role/order, MIME type, byte size and SHA-256. Binary data is not stored in Postgres. Asset record creation does not itself verify an object exists; a future worker must perform upload and hash verification.

`Tag` and `Collection` have many-to-many joins to items. `ItemMetadata` contains a JSONB value, key, timestamp and provenance (`user`, `imported`, `instagram`, `ai`). Enrichment should add provenance-bearing metadata and must not silently overwrite user fields. Foreign keys cascade item-owned records; deleting a database row does not delete archived objects. Object cleanup requires an explicit future policy.

pgvector is enabled by the initial migration. No model-specific embedding dimension is frozen before selecting an enrichment provider. Semantic indexes and full-text search arrive with search implementation.

## Follow-up sequence

1. Real PostgreSQL container smoke test and production runtime/provider decision.
2. Session login, token management and app-internal server functions sharing the domain service.
3. iPad Mini -> iPad -> desktop library, detail and capture workflows; iPhone as capture interface.
4. PWA install/offline policy and authenticated Apple Shortcut capture.
5. Instagram export import, tags/collections editing, custom metadata and full-text search.
6. Durable media archive queue, S3 adapter, checksums, removed-content handling and complete JSON export.
7. Optional enrichment, OCR/transcription and semantic search.

## Decisions

- [ADR 001: TanStack Start](001-tanstack-start.md)
- [ADR 002: Source-independent saved items](002-saved-item.md)
- [ADR 003: Media outside PostgreSQL](003-media-storage.md)
- [ADR 004: Versioned capture API](004-capture-api.md)

## Sources

Framework setup follows the [TanStack build-from-scratch guide](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) and [server-route conventions](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes). Persistence uses [Drizzle PostgreSQL support](https://orm.drizzle.team/docs/get-started-postgresql). Dependencies are pinned by `package-lock.json`.
