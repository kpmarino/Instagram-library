# ADR 003: Media outside PostgreSQL

Status: accepted.

Keep binaries in S3-compatible object storage and relational metadata in Postgres. Store bucket/key, checksum, size, MIME type, role and carousel position on `ArchivedAsset`. Avoid persisting expiring signed URLs as object identity.

Archive states are pending, fetching, archived, partial, unavailable and failed. Capturing a link initializes pending; no worker is implemented yet. Future jobs must record best-effort outcomes and keep a usable item when upstream content disappears. Database cascade deletion removes asset metadata, not the object; define retention and cleanup explicitly before implementing deletion.

Enable pgvector now, but choose embedding dimensions only with the enrichment model. Original media, thumbnails and derivatives should use distinct object keys/roles.
