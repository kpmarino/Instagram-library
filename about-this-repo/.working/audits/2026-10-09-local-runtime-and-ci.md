# Local Runtime and CI Verification

## Scope

Continue from merged PR #1 with real PostgreSQL verification, local setup commands and GitHub CI. Work is isolated on `codex/local-testing`.

## Local Results

- Existing Colima ARM64 profile started using official ARM64 Colima 0.10.3 and Lima 2.2.1; system Intel binaries were not replaced.
- Native binaries are staged in ignored `.local-tools/colima-lima/` for restart with `npm run runtime:start`. They are local artifacts, not distributed in Git.
- `instagram-library-db-1` is healthy, with PostgreSQL/pgvector bound to `127.0.0.1:5432` and a named persistent volume.
- `npm run local:setup` creates a mode-600 `.env` with a random token and preserves existing files. `.env` and local binaries are ignored.
- `npm run db:migrate` and `npm run smoke:local` passed against the real container.
- Smoke verified repeat migrations, vector operations, live HTTP auth/validation, SQL persistence and duplicate-note preservation. Its uniquely named test record was removed afterward.
- All 16 existing tests, type check, production build, documentation checks and formatting passed.
- Development server runs at `http://127.0.0.1:3000`; foundation shell was opened in the Codex browser.

## CI Design

Pull-request and main-push workflow uses Node 24 and a disposable PostgreSQL/pgvector service. It runs unit/integration tests, type check, formatting/docs, build, migrations and the same smoke. SHA-pinned checkout/setup-node actions use read-only repository permissions and no production credentials.

## Limits

Login, browsing/editing UI and PWA remain planned. This slice does not implement session auth or production hosting. The development server and local database are left running for the owner's testing. GitHub execution results are reported with the pull request.
