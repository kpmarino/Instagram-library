# Use the Local Library

## Start and Sign In

From the UI implementation worktree:

```bash
cd /Users/KevinM/Projects/instagram-library/.worktrees/bulk-links
npm ci
npm run local:setup
npm run auth:setup
npm run db:up
npm run db:migrate
npm run dev
```

Open `http://127.0.0.1:3000/`. Read the private password locally with `cat .local-login`, then enter it at Sign in. Do not paste credentials into chat or commit them. Setup preserves existing environment configuration and never prints the password. The generated password file is mode 600 and ignored by Git.

If Colima is stopped, start your native runtime first; see [Local Development Runbook](../runbooks/runbook-local-development.md). The database volume is shared across worktrees through the stable Compose project name.

## Capture and Annotate

Choose Add link. Enter an HTTP(S) URL, an optional title and notes, then Save link. Duplicate captures show a notice and keep your existing title and notes. Choose Edit to update them explicitly. Search matches title, notes or canonical URL; Previous/Next browse additional pages.

Captured URLs are links only. Media retrieval is not implemented.

## Reset Local Login

Stop the dev server. Remove the `OWNER_PASSWORD_HASH` line from `.env`, remove `.local-login`, then run `npm run auth:setup`. Revoke existing sessions before restarting:

```bash
docker compose -p instagram-library exec db psql -U library -d library -c 'DELETE FROM owner_sessions;'
```

This signs out every browser but leaves saved links intact. Retain `.env` file permissions at 600. A missing generated password file cannot be recovered from its hash; reset it using these steps.

## Bulk Add Extracted Links

Choose Bulk add. Paste one URL per line, then Import links. The app accepts plain URLs, bullet or numbered lists, Markdown links such as `[Post](https://www.instagram.com/p/ABC/)`, and angle-bracket URLs. Remove headings, prose, code fences and multiple URLs on the same line from AI output; these are reported as invalid entries. Markdown labels are not imported as titles.

A batch can contain up to 100 nonblank entries and 20,000 characters, within the endpoint's 32 KiB UTF-8 JSON body limit. Blank lines are ignored. The preview shows valid and invalid counts. Each result is labelled Saved, Already saved, Invalid or Failed with its original line number. Existing titles and notes are kept.

Choose Edit list to correct invalid lines. Retry failed links prepares a list containing only failed URLs; choose Import links to submit it. Each URL saves independently, so earlier successful entries remain saved if a later one fails. Repeating a batch after an interruption is safe: duplicates preserve existing data.

AI extraction takes place in your own external tool. The app does not access that AI, fetch source pages or download media.
