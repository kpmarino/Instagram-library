# ADR-005: Owner Sessions and shadcn/ui

**Project:** Instagram Library
**Owner:** Kevin
**Status:** In Review
**Last Updated:** 2026-10-09

## Context

Kevin requested continued implementation and shadcn/ui as the default component style guide. The private single-owner library needs browser authentication before browse/edit controls. No external identity provider has been selected.

## Decision

Use the official shadcn registry, Base UI Nova preset, neutral semantic tokens, Geist font and Tailwind v4. Keep checked-in primitives under `src/components/ui`; compose feature components separately. Default variants govern appearance. Desktop uses a table; smaller viewports use stacked rows with the same fields.

Use a server-side scrypt password hash and random opaque sessions stored as SHA-256 digests in PostgreSQL. Sessions expire after seven days and logout deletes the session. Cookies are HttpOnly, SameSite=Strict, and Secure on HTTPS. Require matching Origin on every browser mutation, including login. Keep the external bearer capture token separate.

## Consequences

No external provider/account dependency is required for local testing. This is a local single-owner implementation, not a production identity service. Login attempts use a process-wide ten-attempt/minute limit; multi-process deployment needs a shared limiter. Password reset and session revocation use documented local administration, not a UI. There is no automatic cloud sync, Instagram credential, scraping or media retrieval.

## Review

Implemented by Codex; pending human review. The user's component-system choice is explicit; the detailed layout and session mechanism are implementation decisions, not claims of human design approval.
