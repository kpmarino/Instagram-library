# Instagram Library

Personal saved-content archive built with TanStack Start, React, TypeScript and PostgreSQL/pgvector. The foundation supports authenticated URL capture; full browsing, PWA, import, media backup and search remain planned.

## Quick Start

Use Node 24 (`.nvmrc`). Run from the separate implementation checkout:

```bash
cd /Users/KevinM/Projects/instagram-library/.worktrees/local-testing
npm ci
npm run local:setup
npm run db:up
npm run db:migrate
npm run smoke:local
npm run dev
```

Open `http://127.0.0.1:3000`. See [Development Setup](docs/how-to/how-to-setup-development.md) for environment and database details.

## Documentation

- [Technical Documentation](docs/README.md)
- [Planning and Decisions](about-this-repo/planning/README.md)
- [Roadmap](ROADMAP.md)
- [Cloud Context Reconciliation](about-this-repo/planning/discussions/cloud-context-reconciliation.md)
- [Documentation Maintenance](docs/how-to/how-to-maintain-documentation.md)

## Checks

```bash
npm test
npm run typecheck
npm run build
npm run format:check
npm run docs:check
npm run smoke:local
```

## Repository Status

Foundation PR #1 is merged on GitHub. Local testing/CI work uses `codex/local-testing` in a separate worktree with sandboxing enabled. Production deployment remains deferred. Cloud chats remain historical sources; this repository holds the consolidated implementation and planning.

## Ownership and License

Owner: Kevin. Private personal project; no redistribution license has been selected. No license grant is implied by documentation-hub scaffolding.
