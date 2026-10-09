# Capture Your First URL

## Goal

Learn how URL capture validates input, writes a saved item and handles duplicate saves. This tutorial uses the local API, not a browser capture form.

## Prepare

Complete [Development Setup](../how-to/how-to-setup-development.md), including the database migration and token. Keep the development server running.

## Send a Capture

In a second terminal at the worktree root, use Node's environment loader so the token stays out of command arguments:

```bash
node --env-file=.env --input-type=module <<'JS'
const response = await fetch('http://127.0.0.1:3000/api/v1/items', {
  method: 'POST',
  headers: {
    authorization: `Bearer ${process.env.INGESTION_API_TOKEN}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.org/my-first-save',
    title: 'My first saved link',
    notes: 'Captured through the local API',
  }),
})
console.log(response.status, await response.json())
JS
```

A first capture returns 201 and `created: true` with a generated item ID. `archiveStatus` is pending: no remote content was fetched.

## Repeat the Capture

Run the same command again. Expect 200, `created: false` and the same ID. The original notes/title remain intact.

## What You Learned

Capture stores URL provenance and user fields. Deduplication is database-enforced; archive retrieval and browsing are separate future features. See [API Reference](../reference/reference-ingestion-api.md) for optional fields and errors.
