# Capability Inventory

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Purpose

Track what the local application actually implements. Planned capabilities are explicitly distinguished from schema support.

## System Overview

Single-user TanStack Start personal-library foundation. Code and planning are local; no deployment or upstream provider configuration exists.

## Architecture Summary

Routes -> domain validation -> ingestion service -> Drizzle/PostgreSQL. Asset metadata anticipates S3 storage. pgvector is enabled without embeddings.

## Capability Catalog

| Capability                       | State             | Evidence                        |
| -------------------------------- | ----------------- | ------------------------------- |
| SSR foundation shell             | Implemented       | `src/routes/index.tsx`          |
| Strict URL capture               | Implemented       | `src/domain/items/ingestion.ts` |
| Bearer HTTP endpoint             | Implemented       | `src/routes/api.v1.items.ts`    |
| Race-safe duplicate saves        | Implemented       | Service and persistence tests   |
| Tags/collections/custom metadata | Schema only       | `src/db/schema/index.ts`        |
| Assets/checksum/archive statuses | Schema only       | Migration and schema            |
| pgvector                         | Extension enabled | Migration integration test      |
| Private browse/edit/search       | Planned           | Requirements                    |
| PWA/Shortcut/import/export       | Planned           | Requirements                    |
| Media workers/S3 operations      | Planned           | No retrieval code               |
| Login and token management       | Planned           | Only environment token exists   |
| AI/OCR/transcription/embeddings  | Deferred          | No provider calls               |

## Data Dependencies

PostgreSQL runtime, PGlite/pgvector tests, local Compose image and server environment variables. No external service accounts configured.

## Reusable Patterns

Canonical URL uniqueness, preservation of user metadata, source-independent item model, explicit provenance and server-only credentials.

## What Should Not Be Ported Directly

Historical vendor pricing/API claims, assistant-generated approval assumptions, example GraphQL/RBAC plans and obsolete Next.js/native-app proposals.

## Migration Boundary

Cloud requirements and useful planning are consolidated locally. Chat containers and historical transcripts remain in the app; no automatic sync is configured.

## Open Questions

See [Requirements](02_PRODUCT_REQUIREMENTS.md) for provider/retention decisions.
