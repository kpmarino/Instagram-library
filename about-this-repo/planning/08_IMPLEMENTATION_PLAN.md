# Implementation Plan

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-09

## Executive Summary

Use small reviewable phases. Foundation is complete; the product is not released.

## Implementation Approach

Separate Git worktrees, sandboxed development, local commits. Use concrete acceptance criteria, not speculative calendar promises.

## Phases and Milestones

| Phase | Work                                          | Exit Criteria                                          | Status                |
| ----- | --------------------------------------------- | ------------------------------------------------------ | --------------------- |
| 0     | TanStack/schema/API foundation                | Tests, type check, build and schema verification       | Complete at `e045ece` |
| 1     | Documentation and cloud-context consolidation | Filled planning docs, links and lint valid             | Complete in PR #1     |
| 2     | Real database/runtime and session auth        | Container smoke, private sessions, token lifecycle     | Planned               |
| 3     | Tablet library/detail/capture                 | Save, browse, annotate and find on iPad/desktop        | Planned               |
| 4     | PWA, Shortcut and export import               | Device capture and duplicate-safe import verified      | Planned               |
| 5     | Archive queue/S3 and portable export          | Hash-verified assets, accurate failure states, restore | Planned               |
| 6     | AI/semantic search                            | Opt-in provenance-preserving enrichment                | Deferred              |

## Detailed Timeline

No dates assigned. Auth precedes private mutation UI; storage/retry design precedes archive jobs; export restore needs a stable data/asset manifest.

## Resource Plan

Owner: Kevin. Modest cloud/API costs are acceptable; budget and providers are undecided.

## Technical Work Breakdown

Follow phase exit criteria. Do not make the documentation task an implicit authorization to implement all later features.

## Dependencies

Actual export sample, real device testing, identity/runtime/storage selection and real PostgreSQL verification.

## Risk Management

Keep source availability separate from archive availability. Make imports repeatable and jobs retryable. Revalidate platform/API research before implementation.

## Quality Assurance

Functional changes require tests/type check/build. Documentation requires lint, local-link validation and scaffold validation. Record limitations explicitly.

## Deployment Strategy

No public deployment or GitHub setup in this task. Future deployment requires auth, secret storage, backup/restore and worker operation checks.

## Communication Plan

Update the capability inventory and roadmap when a phase is complete. Record decisions in ADRs and working notes.

## Post-Launch

Review finding/capture usability, archive success, cost and restore behavior after a usable release exists.

## Change Control

Mark new product proposals as draft until accepted. Record scope changes before implementing provider-dependent features.

## Appendix

[Requirements](02_PRODUCT_REQUIREMENTS.md).

## Local Verification and CI Slice

The next authorized slice adds real-container/API smoke testing, repeatable private local setup and GitHub CI. Owner session auth and the responsive save/browse/edit workflow are now implemented on codex/library-ui for review. Physical-device testing remains pending. GitHub is connected and PR #1 is merged; production deployment is still out of scope.

## Browser Workflow Slice

The continued-build request authorizes owner login, capture, browse, literal substring search and title/notes editing, using shadcn/ui as the default component system. Local runtime and UI work remain reviewable in separate stacked branches. Token-management UI, offline PWA, imports, media and AI remain outside this slice.

## Bulk Paste Scope

Kevin explicitly requested bulk link addition to use URLs extracted with an external AI tool. Implement paste-only batches, bounded input, per-entry outcomes and duplicate-safe retries within the existing private library. External AI integration, source scraping, metadata extraction, export-file import and media retrieval are not part of this request. Implementation is pending human review.
