# Problem Statement and Goals

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Executive Summary

Build a personal library of saved Instagram links, custom metadata, and best-effort media backups. The local repository is the implementation and planning source of truth. Cloud conversations remain historical sources.

## The Problem

Saved links are difficult to find by the owner's own concepts and notes. Removed posts can leave links unusable. The user wants an independent archive rather than a UI coupled to Instagram availability.

## Business Goals

- Find saved content using titles, notes, tags, collections and eventually search.
- Capture a link through an endpoint or PWA paste workflow.
- Preserve retrievable images/videos and provenance when upstream content disappears.
- Learn TanStack Start while keeping cloud hosting costs modest.

Success measures are scenario based: capture once, find it again, retain user edits across re-imports, and recover exported metadata and archived files. Cost and latency targets have not been chosen.

## Stakeholders

Kevin is the owner, primary user and decision maker. Coding assistants support implementation; generated plans do not constitute user approval of every proposed feature.

## Constraints and Assumptions

Use worktrees, sandboxing and local commits. GitHub setup comes later. Prioritize iPad Mini, iPad and desktop; iPhone primarily captures links. No automatic logged-in Instagram scraping. External service access is not configured.

## Success Criteria

Foundation is complete at commit `e045ece`. Full product completion requires a usable private capture/browse/search workflow and export/restore verification. Rich UI, auth and media workers are not yet implemented.

## Risks and Dependencies

Export format, media retrieval capability, platform share integration and hosting costs need verification at implementation time. Do not treat older assistant statements about vendor APIs or pricing as current facts.

## Next Steps

Follow [Implementation Plan](08_IMPLEMENTATION_PLAN.md).

## References

See [Cloud Context Reconciliation](discussions/cloud-context-reconciliation.md) for direct requests and proposed features.
