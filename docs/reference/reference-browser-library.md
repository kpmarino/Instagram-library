# Browser Library Reference

## Interface

Sign in with the owner password, add a URL with an optional title and notes, search title/notes/canonical URL, and edit titles and notes. Results are ordered by save date then ID, with 25 rows per page. Search is a literal case-insensitive substring query; it is not semantic or indexed full-text search. Empty, loading, error and duplicate feedback states are explicit.

The shadcn/ui Base UI Nova preset is the component default. Source primitives are in `src/components/ui`; application compositions are in `src/components/library`. The desktop table becomes stacked rows below 768px. Dialogs provide labelled controls, keyboard focus handling and a close/cancel action. Notes are truncated in lists and fully editable in the dialog. URLs open in a separate tab with opener isolation. Capturing a URL does not download its media.

## Internal Endpoint

`GET /api/library?q=...&page=0` requires a valid owner session. It returns `items` and `hasMore`. Search is limited to 200 characters and page numbers to 0–10000. Responses use `Cache-Control: no-store`.

`POST /api/library` requires JSON and an Origin equal to the request URL's origin. Request bodies are limited to 32 KiB.

| Action    | Input                          | Result                                            |
| --------- | ------------------------------ | ------------------------------------------------- |
| `login`   | `password`                     | Creates session cookie; 200 or 401                |
| `logout`  | None                           | Deletes current session and clears cookie         |
| `capture` | `input: {url, title?, notes?}` | 201 new; 200 existing, without metadata overwrite |
| `edit`    | `input: {id, title, notes}`    | 200 saved; 404 missing                            |

Only login is permitted without a session. Titles have a 500-character limit; notes have a 20000-character limit. Edit rejects extra input fields and cannot change URL, source or saved date. Login throttles at ten attempts per minute per server process. Errors use generic persistence messages; credentials and connection details are not returned.

## Session Model

Opaque 256-bit tokens live in an HttpOnly, SameSite=Strict cookie. Only token digests are stored in `owner_sessions`. Expiry is enforced on every request; expired rows are cleaned on login. HTTPS requests receive Secure cookies. Logout revokes the database session. A password-hash change alone does not revoke existing sessions; delete sessions when resetting credentials.

## Limits

Single owner; no roles, public sharing, password reset UI or token manager. No PWA caching, import, tags/collections UI, media backup or AI enrichment. Production proxy/origin handling, a shared rate limiter, TLS and backup operations need separate verification before deployment.
