# API Design and Conventions

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Design Philosophy

REST for external capture; future server functions for internal UI. The hub's generic GraphQL examples are not project decisions.

## API Strategy

Implemented: `POST /api/v1/items`. Proposed: authenticated app mutations and import/token/export endpoints, with paths undecided. No GraphQL, WebSocket or tool API is required today.

## REST Conventions

Version external contracts under `/api/v1`. JSON success is `{ item, created }`; errors use `{ error }` and may include validation issues. Strict input rejects unknown fields.

## Shared Patterns

Bearer token required; 32 KiB streamed body limit; no-store responses. 201 means inserted, 200 means existing duplicate. Validation errors are 400; auth 401; body limit 413; media type 415; configuration/persistence 503.

## API Documentation

[Implemented API Reference](../../docs/reference/reference-ingestion-api.md) is authoritative for callers.

## Open Questions

Pagination, patch semantics, idempotent import jobs, token lifecycle and rate limits will be specified with those features.
