# Data Model

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Scope

The current schema is source independent and single user. Original URL and source metadata carry provenance; user fields have explicit editing semantics.

## Authentication Tables

Not implemented. Identity/session/token tables depend on the selected auth approach.

## Application Tables

| Table                           | Purpose                                                              | State              |
| ------------------------------- | -------------------------------------------------------------------- | ------------------ |
| `saved_items`                   | Capture/source metadata, user title/notes, timestamps, archive state | Implemented        |
| `archived_assets`               | Bucket/key, MIME type, size, SHA-256, role/order                     | Implemented schema |
| `tags`, `collections`           | Library taxonomy                                                     | Implemented schema |
| `item_tags`, `item_collections` | Many-to-many joins                                                   | Implemented schema |
| `item_metadata`                 | JSONB custom values and provenance                                   | Implemented schema |

Canonical URL has a unique index. Relationships cascade item-owned metadata; object storage deletion remains a separate policy. See [Database Reference](../../docs/reference/reference-database.md) for exact implemented behavior.

## Enums and Lookups

Archive statuses: pending, fetching, archived, partial, unavailable, failed. Metadata provenance: user, imported, instagram, ai. Constraints enforce these values.

## Migration and Governance

Versioned Drizzle SQL enables pgvector. No embedding dimension is selected yet. Future changes require new migrations, refreshed reference docs and regression checks. Keep imported source data and generated values distinguishable from user edits.

## Related Documents

[Architecture](../../docs/explanations/explanation-architecture.md).

## Owner Sessions

Migration 0001 adds owner_sessions with a hashed opaque token primary key, expiry and creation date. It is single-owner authentication; there is no ownership column or multiuser model.
