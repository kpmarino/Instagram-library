# UI Design System

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-09

## Design Philosophy

Readable, accessible and efficient on iPad Mini, iPad and desktop. The owner explicitly selected shadcn/ui as the default component style guide. Detailed layout is implemented and pending human review.

## Design Brief

Prioritize finding saved material and annotating it; avoid inventing dashboards or statistics. Use real item/archive states. iPhone is primarily for capture.

## App Shell and Layout

Current library uses official shadcn/ui Base UI Nova, neutral semantic colors, white background, Geist typography and a 1152px maximum outer width. Validate keyboard behavior and touch targets during UI implementation.

## Color and Typography

Use the standard preset tokens in src/styles.css. Maintain legible contrast and responsive text. Respect reduced-motion preferences if motion is introduced.

## Components

Implemented: owner login, search field, URL capture dialog, responsive list/table and title/notes editor. Tags/collections, archive retrieval and broader metadata controls remain planned.

## Related Documents

[Wireframes](04_WIREFRAMES.md).
