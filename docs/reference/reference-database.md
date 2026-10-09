# Database Reference

## Runtime and Migration

PostgreSQL plus pgvector using Drizzle/node-postgres. SQL and snapshots live under `src/db/migrations`; `src/db/schema/index.ts` is the typed schema. Initial migration enables the vector extension; embeddings are not stored yet.

## Tables

| Table              | Key Data                                                                                                                    | Constraints                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `saved_items`      | Original/canonical URL, source/ID, title, notes, creator/caption/type, source JSONB, save/create timestamps, archive status | UUID primary key; unique canonical URL; valid archive status           |
| `archived_assets`  | Item ID, bucket/key, original URL, role, MIME, bytes, SHA-256, position/date                                                | Item FK; unique bucket/key; nonnegative bytes; lowercase 64-digit hash |
| `tags`             | UUID and name                                                                                                               | Unique name                                                            |
| `collections`      | UUID, name, description/date                                                                                                | Unique name                                                            |
| `item_tags`        | Item and tag IDs                                                                                                            | Composite primary key; cascading FKs                                   |
| `item_collections` | Item and collection IDs                                                                                                     | Composite primary key; cascading FKs                                   |
| `item_metadata`    | Item, key, JSONB value, provenance/date                                                                                     | Item FK; valid provenance                                              |

Archive statuses: pending, fetching, archived, partial, unavailable, failed. Provenance: user, imported, instagram, ai. Foreign keys cascade item-owned records. Object deletion is not implemented by a database cascade.

## Save Semantics

The service inserts with conflict-do-nothing on canonical URL, then reads an existing duplicate. User title/notes/save date are preserved. No tag/collection/metadata mutation endpoints exist.

## Limitations

No ownership/session/token tables, worker queue, full-text index or embedding dimension. Asset metadata does not prove that a storage object exists or that its hash has been verified by a worker.
