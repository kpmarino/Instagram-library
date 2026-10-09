---
name: docs-writer
description:
  Apply ASG documentation standards and style guide. Use when writing,
  reviewing, or editing documentation — README files, markdown docs, planning
  documents (Shape Up style under about-this-repo/planning), or Diataxis technical
  documentation under docs/. Covers naming conventions, markdown formatting, and
  git commit format.
paths:
  - '**/*.md'
  - 'docs/**/*.md'
  - 'about-this-repo/**/*.md'
allowed-tools: Read, Edit, Grep, Bash
---

# ASG Documentation Standards — docs-writer Skill

## Repository layout (ASG scaffold)

- **Technical docs (Diataxis):** `docs/` (`tutorials/`, `how-to/`, `explanations/`,
  `reference/`, `runbooks/`).
- **Planning (Shape Up):** `about-this-repo/planning/` (numbered `01_`–`08_` docs,
  ADRs).
- **Working notes:** `about-this-repo/.working/sessions/` for dated session
  summaries; `about-this-repo/.working/audits/` for compliance or lint audits.

Before recommending repo structure changes, read `about-this-repo/README.md`,
`about-this-repo/planning/`, and recent files under `about-this-repo/.working/`.

## Automation behavior (default)

- Run in **automatic mode first**: make safe edits directly and report what changed.
- Ask questions **only** when blocked by missing factual inputs (for example owner
  name, compliance requirement, or destructive move choice).
- Do not ask whether to fill every planning template by default. Keep non-applicable
  planning files as stubs, and if needed move them to
  `about-this-repo/planning/_not-applicable/` with a short reason note.
- If legacy docs exist under `documentation/`, prefer normalizing into `docs/`
  layout and preserve content before creating new stubs.

## Documentation hub (templates and standards)

Keep a clone of your organization’s **documentation-hub** repository available. Set
`$hub` (PowerShell) or your own variable to that root when copying templates. From
there use `templates/planning/`, `templates/diataxis/`, `docs/standards/`, and
`implementation/ai-rules/prompts/documentation-prompts.md` when authoring or
reviewing documentation.

## Required `docs/` folders (mandatory)

Every project must use these Diataxis directories under **`docs/`** (SharePoint-friendly):

- **`docs/tutorials/`** — `tutorial-[topic].md`
- **`docs/how-to/`** — `how-to-[task].md`
- **`docs/explanations/`** — `explanation-[concept].md`
- **`docs/reference/`** — `reference-[subject].md`
- **`docs/runbooks/`** — `runbook-[topic].md`
- **`docs/standards/`** — org/project standards

Add **`docs/README.md`** when you have more than a few technical docs.

## Documentation type decision tree

**Planning docs (Shape Up) — use when deciding what to build:**

| Question                      | Document                                              |
| ----------------------------- | ----------------------------------------------------- |
| "Why are we building this?"   | `about-this-repo/planning/01_PROBLEM_GOALS.md`        |
| "What are we building?"       | `about-this-repo/planning/02_PRODUCT_REQUIREMENTS.md` |
| "How will users interact?"    | `about-this-repo/planning/03_USER_FLOWS.md`           |
| "What do screens look like?"  | `about-this-repo/planning/04_WIREFRAMES.md`           |
| "What are the design rules?"  | `about-this-repo/planning/05_UI_DESIGN_SYSTEM.md`     |
| "What is the data structure?" | `about-this-repo/planning/06_DATA_MODEL.md`           |
| "How should we build it?"     | `about-this-repo/planning/07_TECH_SPECIFICATIONS.md`  |
| "When will we build it?"      | `about-this-repo/planning/08_IMPLEMENTATION_PLAN.md`  |
| "Why did we choose this?"     | `about-this-repo/planning/ADR-NNN-title.md`           |

**Diataxis docs — use when documenting what was built:**

| User need                         | Document type | File naming                                  |
| --------------------------------- | ------------- | -------------------------------------------- |
| "How do I learn this?" (new user) | Tutorial      | `docs/tutorials/tutorial-[topic].md`         |
| "How do I do [task]?"             | How-to        | `docs/how-to/how-to-[task].md`               |
| "Why does it work this way?"      | Explanation   | `docs/explanations/explanation-[concept].md` |
| "What are the exact specs?"       | Reference     | `docs/reference/reference-[subject].md`      |
| "System is broken, fix it"        | Runbook       | `docs/runbooks/runbook.md`                   |

## Planning doc templates

Location in documentation-hub: **`$hub/templates/planning/`**. **`asg-docs init`**
(without **`--no-planning`**) materializes **01**–**12** plus **`ADR_TEMPLATE.md`**
into **`about-this-repo/planning/`** (same mapping as **`.cursor/rules/documentation.mdc`**).
For new ADRs, copy **`ADR_TEMPLATE.md`** to **`ADR-NNN-short-title.md`**.

Required metadata header in every planning doc:

```markdown
**Project:** [project name]
**Owner:** [name]
**Status:** Draft | In Review | Approved
**Last Updated:** YYYY-MM-DD
```

## Diataxis doc templates

Location in documentation-hub: `templates/diataxis/`

Strict type separation — one document = one type. No hybrid documents.

## Naming conventions

Planning docs: numbered prefix under `about-this-repo/planning/` —
`07_TECH_SPECIFICATIONS.md`

Diataxis docs: kebab-case with type prefix — `how-to-deploy-production.md`

Root files: UPPERCASE — `README.md`, `CHANGELOG.md`, `RUNBOOK.md`, `SBOM.md`

## Markdown rules (enforce without exception)

MD031 — blank line before AND after every code fence

MD032 — blank line before AND after every list (most commonly violated)

MD036 — never use **bold** as a heading substitute; use `## Heading` instead

MD040 — every code block must specify a language: `bash`, `powershell`, `json`,
`yaml`, `typescript`, `javascript`, `python`, `php`, `sql`, `html`, `css`, `text`

Also enforce: no trailing whitespace, no hard tabs, max one consecutive blank line,
single newline at end of file.

## Git commit format

```text
docs: [brief description]

Source: [AI | Developer | AI + Developer]
Review status: Pending human review
AI Engine(s): [Claude (Anthropic) | if applicable]

[Optional detail about what was changed and why]
```

## Quality checklist — run before completing any documentation task

- [ ] Correct document type for the content (planning vs technical, correct Diataxis
      type)
- [ ] Metadata header present (planning docs)
- [ ] All required sections from the template are present
- [ ] All code blocks have a language specified
- [ ] Blank lines around all headings, lists, and code fences
- [ ] No markdownlint violations
- [ ] File named correctly for its type
- [ ] `about-this-repo/` context checked when editing this repository’s meta-docs
- [ ] Links and cross-references are valid

## Full prompt library

For detailed prompts covering all documentation scenarios, see
`implementation/ai-rules/prompts/documentation-prompts.md` inside documentation-hub.
