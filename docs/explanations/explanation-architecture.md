# Library Architecture

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

## Browser Library

Session and origin checks gate the internal library endpoint. Route files delegate to server services; list/edit query logic stays outside routing. The browser receives only list fields, never password hashes, session digests or ingestion credentials. The official shadcn/ui Base UI Nova components are the default UI system. See [Browser Library Reference](../reference/reference-browser-library.md).
