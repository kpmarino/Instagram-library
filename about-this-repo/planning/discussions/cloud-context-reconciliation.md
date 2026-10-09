# Cloud Context Reconciliation

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Source Inventory

| Source                               | ID                                                                             | Useful Material                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Build Instagram Library App          | `6ac01f9b-9bd8-83e9-b3f4-daf2b75c1275`                                         | Product requests, platform priorities, TanStack choice and draft v0.1 |
| Branch · Build Instagram Library App | `6ac70153-6e1c-83ea-acae-a6556fe74d5f`                                         | Repeated architecture and local handoff instructions                  |
| Cloud coding attempts                | `01a1195d-39ab-7177-bce7-f0bf79b020fa`, `01a11986-aec0-7751-909f-ac3fd7ac40c0` | No implementation; cloud workspace could not reach the Mac            |
| Local foundation                     | `e045ece`                                                                      | Actual code, migrations, tests and initial ADRs                       |

Source project: Instagram App (`g-p-6ac70061cafc8191801bbb71ff65e0be`). Local project folder: `/Users/KevinM/Projects/instagram-library`.

## Direct User Requests Preserved

- View saved Instagram posts and attach custom metadata for discovery.
- Modest cloud/API spending is acceptable; host on a cloud provider.
- Send links to an endpoint and paste/copy links into a PWA.
- Prioritize iPad, iPad Mini and desktop; iPhone is last for the main site.
- Back up images/videos where retrievable because posts can disappear.
- Choose TanStack for this personal learning project.
- Use a separate worktree, sandboxing and local commits; GitHub comes later.

## Reconciliation Decisions

The latest TanStack decision supersedes earlier Next.js/plain-Vite suggestions. Preserve the source-independent SavedItem, PostgreSQL/pgvector, Drizzle, media-outside-Postgres and versioned-capture decisions implemented by the agreed foundation.

Keep collections, import, login, tokens, Shortcut, search, portable export and archive workers as a draft v0.1 backlog. Keep AI/semantic search/OCR/transcription later. Do not label assistant proposals as direct user mandates or completed capabilities.

No cloud implementation or data was identified in the inspected tasks. Cloud discussions remain history, while the local documents are the consolidated working context. No project-level container merge, deletion, archive or synchronization was performed.

## Historical Claims Requiring Revalidation

Cloud answers contained time-sensitive statements about Instagram saved APIs/oEmbed/export formats, Safari share targets, framework maturity, provider pricing and hosting. These are not copied as current facts. Verify them from primary sources when implementing the relevant adapter/platform flow.

## Local Destinations

- [Requirements](../02_PRODUCT_REQUIREMENTS.md)
- [Implementation Plan](../08_IMPLEMENTATION_PLAN.md)
- [Capabilities](../12_CAPABILITY_INVENTORY.md)
- [Architecture](../../../docs/explanations/explanation-architecture.md)
