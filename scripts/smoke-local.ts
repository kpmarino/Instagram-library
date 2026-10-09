import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createHash } from 'node:crypto'
import { hashPassword } from '../src/services/auth/password.server'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

if (!process.env.DATABASE_URL || !process.env.INGESTION_API_TOKEN)
  throw new Error('Configure DATABASE_URL and INGESTION_API_TOKEN first.')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
})
const db = drizzle(pool)
const canonicalUrl = `https://example.org/library-smoke/${randomUUID()}`
let server: ReturnType<typeof spawn> | undefined
let serverExited: Promise<void> | undefined
let sessionHash: string | undefined
const smokePassword = randomUUID()
try {
  // Exercise real node-postgres migrations, including repeat application.
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  const vector = await pool.query(
    "SELECT '[1,2,3]'::vector <-> '[1,2,3]'::vector AS distance",
  )
  assert.equal(vector.rows[0].distance, 0)
  console.log('PostgreSQL migration and pgvector verified.')

  const port = 3101
  server = spawn(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      env: { ...process.env, OWNER_PASSWORD_HASH: hashPassword(smokePassword) },
      stdio: 'ignore',
    },
  )
  serverExited = new Promise((resolve) => server!.once('exit', () => resolve()))
  const base = `http://127.0.0.1:${port}`
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null)
      throw new Error(
        'Smoke-test server exited before becoming ready; check port 3101.',
      )
    try {
      const response = await fetch(base, { signal: AbortSignal.timeout(1000) })
      if (response.ok) {
        ready = true
        break
      }
    } catch {
      /* Wait for our newly started server. */
    }
    await delay(200)
  }
  assert.ok(ready, 'Smoke-test server did not become ready')
  const capture = (data: unknown, authorized = true) =>
    fetch(`${base}/api/v1/items`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(authorized
          ? { authorization: `Bearer ${process.env.INGESTION_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000),
    })
  assert.equal((await capture({ url: canonicalUrl }, false)).status, 401)
  assert.equal((await capture({ url: 'javascript:alert(1)' })).status, 400)
  const first = await capture({
    url: canonicalUrl,
    title: 'Disposable smoke test',
    notes: 'Keep these original notes',
  })
  assert.equal(first.status, 201)
  const created = await first.json()
  assert.equal(created.created, true)
  const duplicate = await capture({
    url: canonicalUrl,
    notes: 'Do not overwrite',
  })
  assert.equal(duplicate.status, 200)
  const existing = await duplicate.json()
  assert.equal(existing.item.id, created.item.id)
  assert.equal(existing.item.notes, 'Keep these original notes')
  const rows = await pool.query(
    'SELECT id, notes FROM saved_items WHERE canonical_url = $1',
    [canonicalUrl],
  )
  assert.equal(rows.rowCount, 1)
  assert.equal(rows.rows[0].id, created.item.id)
  console.log(
    'Live API auth, validation, persistence and duplicate preservation verified.',
  )
  let cookie = ''
  const library = (body?: unknown, origin = base) =>
    fetch(`${base}/api/library`, {
      method: body ? 'POST' : 'GET',
      headers: {
        cookie,
        ...(body ? { 'content-type': 'application/json', origin } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    })
  assert.equal((await library()).status, 401)
  assert.equal(
    (
      await library(
        { action: 'login', password: smokePassword },
        'https://evil.example',
      )
    ).status,
    403,
  )
  const login = await library({ action: 'login', password: smokePassword })
  assert.equal(login.status, 200)
  cookie = login.headers.get('set-cookie')!.split(';')[0]
  sessionHash = createHash('sha256').update(cookie.split('=')[1]).digest('hex')
  assert.equal((await library()).status, 200)
  assert.equal(
    (
      await library({
        action: 'edit',
        input: {
          id: created.item.id,
          title: 'Edited smoke title',
          notes: 'Edited smoke notes',
        },
      })
    ).status,
    200,
  )
  assert.equal(
    (
      await library({
        action: 'capture',
        input: { url: canonicalUrl, notes: 'Overwrite attempt' },
      })
    ).status,
    200,
  )
  const edited = await pool.query(
    'SELECT title, notes FROM saved_items WHERE id = $1',
    [created.item.id],
  )
  assert.equal(edited.rows[0].notes, 'Edited smoke notes')
  assert.equal(edited.rows[0].title, 'Edited smoke title')
  assert.equal((await library({ action: 'logout' })).status, 200)
  assert.equal((await library()).status, 401)
  console.log(
    'Live browser-session authentication, CSRF protection, edits, duplicate preservation and logout verified.',
  )
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM')
    await Promise.race([serverExited, delay(3000)])
    if (server.exitCode === null) server.kill('SIGKILL')
  }
  try {
    if (sessionHash)
      await pool.query('DELETE FROM owner_sessions WHERE token_hash = $1', [
        sessionHash,
      ])
    await pool.query('DELETE FROM saved_items WHERE canonical_url = $1', [
      canonicalUrl,
    ])
  } finally {
    await pool.end()
  }
}
