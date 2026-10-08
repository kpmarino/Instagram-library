# ADR 004: Versioned capture API

Status: accepted.

Expose `POST /api/v1/items` for external ingestion, including a future Apple Shortcut. Use a server-only bearer token in this single-user foundation; full token lifecycle and session login come later. API token authentication is intentionally distinct from future Instagram authorization.

Validate bounded JSON at the HTTP boundary. Return 201 on insert, 200 for a duplicate and a stable error shape. Database uniqueness enforces race-safe deduplication. Keep the save service independent of TanStack; future app-internal server functions should call this service, with their own authenticated session boundary.

A capture API gives iPhone/iPad a straightforward integration path without making a native app foundational. PWA and Shortcut delivery need their own platform verification and are not included in the initial scaffold.
