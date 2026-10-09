# Cursor Documentation Rules Index

Purpose: keep Cursor documentation guidance short at the top level and route to
smaller, task-specific rule sources only when needed.

## Rule loading model

- Keep this file as an index/reference, not a full how-to plus sample bundle.
- Put active, agent-requested behavior in `.mdc` rules under `.cursor/rules/`.
- Use skills under `.agents/skills/` for richer, task-scoped guidance.

## Rule tree (what to load when)

```text
.cursor/rules/
├── documentation.mdc                # Primary doc-writing behavior (agent-requested)
├── documentation-rules.md           # This index (short router)

.agents/skills/
├── docs-writer/SKILL.md             # Detailed standards and workflow
└── changelog-writer/SKILL.md        # On-demand changelog/release-note helper

about-this-repo/planning/
└── *.md                             # Planning records and implementation notes
```

## Canonical sources in documentation-hub

- Cursor rule behavior: `implementation/ai-rules/cursor/documentation.mdc`
- Cursor rule index: `implementation/ai-rules/cursor/documentation-rules.md`
- Agent skill: `templates/project-starter/agents/skills/docs-writer/SKILL.md`
- Changelog skill: `templates/project-starter/agents/skills/changelog-writer/SKILL.md`

## Install/update

Preferred from target project root:

```powershell
npx @asg-architects/documentation-hub init --project-type auto
```

That installs `.cursor/rules/`, `.agents/skills/`, and scaffold docs layout.

On-demand changelog helper:

```powershell
npx @asg-architects/documentation-hub changelog
```

## Scope guardrails

- Avoid adding long inline samples here; keep examples in guides or skills.
- Keep links relative and repo-valid.
- If a section grows beyond quick-reference size, move it to a dedicated guide and
  link it from this index.
