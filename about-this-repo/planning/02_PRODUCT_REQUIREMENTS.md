# Product Requirements

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Product Overview

A single-user saved-content library, built for personal use and learning. Instagram is the first rich source; generic HTTP(S) URL capture is supported in the foundation.

## Scope Definition

| Requirement                                | Origin                                    | Current State                    |
| ------------------------------------------ | ----------------------------------------- | -------------------------------- |
| Saved Instagram links with custom metadata | Direct user request                       | Model/API foundation             |
| TanStack Start + React + TypeScript        | User chose TanStack; agreed foundation    | Implemented                      |
| Authenticated URL endpoint                 | Direct user request                       | Implemented, single server token |
| PWA paste/copy capture                     | Direct user request                       | Planned                          |
| iPad Mini, iPad and desktop focus          | Direct user request                       | Minimal shell only               |
| Image/video backup after post removal      | Direct user request                       | Asset schema only                |
| Cloud hosting with modest API costs        | Direct user request                       | Provider undecided               |
| Collections, tags, notes, custom fields    | Agreed direction / assistant expansion    | Schema; editing UI planned       |
| Export import and full-text search         | Assistant proposal retained in draft v0.1 | Planned                          |
| Login, token management and Apple Shortcut | Assistant proposal retained in draft v0.1 | Planned                          |
| Complete JSON export and restore           | Assistant proposal retained in draft v0.1 | Planned                          |
| Semantic search, OCR, transcription and AI | Later proposal                            | Deferred                         |

## User Requirements

As the owner, I want to capture a URL quickly, add my own description, and find it by useful metadata. I want archived media to remain viewable when the source disappears, when retrieval was possible.

## Functional Requirements

The proposed v0.1 includes private login, URL/PWA capture, Shortcut integration, Instagram export import, collection/tag editing, notes/custom fields, lexical search, best-effort media archiving and complete JSON export. It is a draft product backlog, not a claim that these features exist. Native apps, multiuser sharing, logged-in scraping and AI are excluded from this cycle.

## Non-Functional Requirements

Preserve user metadata on duplicate capture. Keep secrets server-side. Use keyboard-accessible controls, readable tablet layouts and explicit unavailable/partial archive states. Establish measured performance and hosting budgets before choosing a production provider.

## User Experience Requirements

Design for iPad Mini -> iPad -> desktop. iPhone is lower priority for browsing and primarily a capture device. No product design has been approved yet.

## Data Requirements

Inputs are URLs and future export files. Outputs are saved items and eventual portable JSON plus archived-file metadata. Deletion/retention policy is undecided; do not silently delete objects when deleting database rows.

## Integration Requirements

HTTP capture is implemented. S3-compatible storage, identity provider, Instagram retrieval and Shortcut installation require future implementation and live verification.

## Assumptions

Single owner; no legacy app/database to migrate. Existing upstream source data should be preserved where available.

## Open Questions

Choose identity provider, cloud runtime, storage provider, archive retention and allowable monthly spend. Verify an actual Instagram export sample and iOS capture path.

## Success Criteria

Demonstrate save -> annotate -> find -> export/restore with real test data. Demonstrate archived media remains available after a simulated missing source, with accurate retrieval status.

## Timeline and Milestones

See [Implementation Plan](08_IMPLEMENTATION_PLAN.md); no dates are promised.

## Appendix

Source status is recorded in [Cloud Context Reconciliation](discussions/cloud-context-reconciliation.md).
