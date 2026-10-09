# User Flows

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Overview

Capture and retrieval are separate workflows. Only API capture currently exists.

## Flow Format

Each flow records an entry point, action, result and error state.

## Primary User Flows

### URL capture

Entry: authorized client sends JSON to `POST /api/v1/items`. Validate -> canonicalize -> insert or read duplicate -> return 201/200. Missing token returns 401; missing configuration returns 503. Existing notes/title are preserved.

### Browse and annotate

Planned: login -> library -> item detail -> edit title/notes/tags/custom metadata -> save explicit mutation. Search and collection filters narrow the library. No working product controls exist yet.

### Media recovery

Planned: capture -> durable archive job -> asset upload/hash verification -> archived/partial/unavailable/failed result. Item remains useful if media retrieval fails or upstream content disappears.

## Secondary User Flows

Planned: import export file with duplicate-safe preview; Shortcut capture; portable JSON export with archived-file manifest and restore validation.

## Edge Cases and Error Handling

Handle duplicate imports, expired sessions/tokens, bad URLs, unavailable persistence, missing source media and interrupted jobs. Never replace user-authored metadata with generated/imported fields implicitly.

## Flow Dependencies

Login and mutation authorization precede private UI. Storage and job retries precede archive UI. Platform integration must be tested on real iPad/iPhone.

## Visual Flow Diagrams

```text
Client -> HTTP boundary -> validation -> save service -> PostgreSQL
```

## Validation Notes

The foundation tests cover validation, HTTP outcomes, deduplication and relational persistence. Product flows need later browser/device acceptance tests.

## Related Documents

[Requirements](02_PRODUCT_REQUIREMENTS.md) and [API Design](09_API_DESIGN.md).
