---
name: changelog-writer
description: Create changelog entries, release notes, or session tracking notes from a short question flow. Use only when the user explicitly asks for changelog or release-note help.
disable-model-invocation: true
---

# Changelog Writer

Use this skill only on explicit request. Do not auto-apply for normal documentation
tasks.

## Goal

Generate one of:

- `CHANGELOG.md` entry (Keep a Changelog style)
- release notes draft
- `about-this-repo/.working/sessions/YYYY-MM-DD-*.md` tracking note

## Question flow

Ask and confirm:

1. Output target: changelog, release notes, session note, or both.
2. Scope: since tag/date/PR, or "recent changes".
3. Audience: internal or external.
4. Categories: Added, Changed, Fixed, Security, Deprecated, Removed.
5. Breaking changes: yes/no.
6. Migration note if breaking changes exist.
7. Bullet list of tracked changes.

## Output rules

- Keep language concise and user-facing.
- Avoid raw commit dump text.
- Prefer grouped bullets by category.
- Add placeholders when evidence is missing instead of inventing details.

## Templates

### Changelog entry

```markdown
## [Unreleased]

### Added

- [change]

### Changed

- [change]

### Fixed

- [change]
```

### Release notes

```markdown
# Release notes (YYYY-MM-DD)

## Highlights

- [change]

## Breaking changes

- [migration step]
```

### Session note

```markdown
# Changelog session (YYYY-MM-DD)

## Context

- Scope: [scope]
- Audience: [internal|external]

## Changes tracked

- [change]

## Risks and follow-up

- [risk or follow-up]
```
