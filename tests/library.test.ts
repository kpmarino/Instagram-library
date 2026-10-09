import { beforeAll, afterAll, it, expect } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite-pgvector'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { eq } from 'drizzle-orm'
import * as schema from '../src/db/schema'
import type { getDb } from '../src/db/client.server'
import {
  hashPassword,
  verifyPassword,
} from '../src/services/auth/password.server'
import { handleLibrary } from '../src/services/auth/library-http.server'
const pg = new PGlite({ extensions: { vector } })
const db = drizzle(pg, { schema })
const database = () => db as unknown as ReturnType<typeof getDb>
const hash = hashPassword('test-only-password')
const origin = 'https://library.example'
let cookie = ''
function request(
  body?: unknown,
  options: { cookie?: string; origin?: string; path?: string } = {},
) {
  return new Request(`${origin}/api/library${options.path ?? ''}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(body
        ? {
            'content-type': 'application/json',
            origin: options.origin ?? origin,
          }
        : {}),
      cookie: options.cookie ?? cookie,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}
const handle = (req: Request) => handleLibrary(req, database, hash)
beforeAll(async () => {
  await migrate(db, { migrationsFolder: './src/db/migrations' })
}, 30000)
afterAll(async () => {
  await pg.close()
})
it('hashes passwords and fails closed for malformed configuration', () => {
  expect(verifyPassword('test-only-password', hash)).toBe(true)
  expect(verifyPassword('wrong', hash)).toBe(false)
  expect(verifyPassword('test-only-password', 'bad')).toBe(false)
})
it('rejects unauthenticated reads, edits, and cross-origin login', async () => {
  expect((await handle(request())).status).toBe(401)
  expect((await handle(request({ action: 'edit', input: {} }))).status).toBe(
    401,
  )
  expect(
    (
      await handle(
        request(
          { action: 'login', password: 'test-only-password' },
          { origin: 'https://evil.example' },
        ),
      )
    ).status,
  ).toBe(403)
  expect(
    (await handle(request({ action: 'login', password: 'wrong' }))).status,
  ).toBe(401)
  expect((await handleLibrary(request(), database, undefined)).status).toBe(503)
})
it('issues a private secure cookie and stores only a digest', async () => {
  const response = await handle(
    request({ action: 'login', password: 'test-only-password' }),
  )
  expect(response.status).toBe(200)
  const header = response.headers.get('set-cookie')!
  expect(header).toContain('HttpOnly; SameSite=Strict')
  expect(header).toContain('; Secure')
  cookie = header.split(';')[0]
  const [session] = await db.select().from(schema.ownerSessions)
  expect(session.tokenHash).not.toBe(cookie.split('=')[1])
  expect(response.headers.get('cache-control')).toBe('no-store')
})
it('captures, edits, searches and deduplicates without overwriting metadata', async () => {
  const input = {
    url: 'https://instagram.com/p/UI123/?igsh=x',
    title: 'First',
    notes: 'keep',
  }
  expect((await handle(request({ action: 'capture', input }))).status).toBe(201)
  const listing = await (await handle(request())).json()
  const id = listing.items[0].id
  expect(
    (
      await handle(
        request({
          action: 'edit',
          input: { id, title: 'Updated', notes: 'keep edited' },
        }),
      )
    ).status,
  ).toBe(200)
  expect(
    (
      await handle(
        request({ action: 'capture', input: { ...input, title: 'Discard' } }),
      )
    ).status,
  ).toBe(200)
  const result = await (
    await handle(request(undefined, { path: '?q=edited' }))
  ).json()
  expect(result.items[0].title).toBe('Updated')
  expect(result.items[0].notes).toBe('keep edited')
  expect(result.items[0].canonicalUrl).toBe(
    'https://www.instagram.com/p/UI123/',
  )
  const noMatches = await (
    await handle(request(undefined, { path: '?q=%25' }))
  ).json()
  expect(noMatches.items).toHaveLength(0)
  expect((await handle(request(undefined, { path: '?page=-1' }))).status).toBe(
    400,
  )
  expect(
    (
      await handle(
        request({
          action: 'edit',
          input: {
            id,
            title: 'x',
            notes: '',
            canonicalUrl: 'https://evil.example',
          },
        }),
      )
    ).status,
  ).toBe(400)
})
it('limits request size, returns missing-item errors, and enforces origin on mutations', async () => {
  expect(
    (
      await handle(
        request({ action: 'capture', input: { url: 'javascript:alert(1)' } }),
      )
    ).status,
  ).toBe(400)
  expect(
    (
      await handle(
        request({
          action: 'edit',
          input: {
            id: '00000000-0000-4000-8000-000000000000',
            title: '',
            notes: '',
          },
        }),
      )
    ).status,
  ).toBe(404)
  expect(
    (
      await handle(
        request({ action: 'logout' }, { origin: 'https://evil.example' }),
      )
    ).status,
  ).toBe(403)
  expect(
    (
      await handle(
        request({ action: 'capture', input: { notes: 'x'.repeat(40000) } }),
      )
    ).status,
  ).toBe(413)
})
it('paginates results deterministically', async () => {
  await db.insert(schema.savedItems).values(
    Array.from({ length: 27 }, (_, i) => ({
      originalUrl: `https://example.org/${i}`,
      canonicalUrl: `https://example.org/${i}`,
      source: 'web',
      title: 'page fixture',
    })),
  )
  const first = await (
    await handle(request(undefined, { path: '?q=page&page=0' }))
  ).json()
  const second = await (
    await handle(request(undefined, { path: '?q=page&page=1' }))
  ).json()
  expect(first.items).toHaveLength(25)
  expect(first.hasMore).toBe(true)
  expect(second.items).toHaveLength(2)
  expect(second.hasMore).toBe(false)
  expect(
    new Set([...first.items, ...second.items].map((x: { id: string }) => x.id))
      .size,
  ).toBe(27)
})
it('rejects expired sessions and revokes logout sessions', async () => {
  const [session] = await db.select().from(schema.ownerSessions)
  await db
    .update(schema.ownerSessions)
    .set({ expiresAt: new Date(0) })
    .where(eq(schema.ownerSessions.tokenHash, session.tokenHash))
  expect((await handle(request())).status).toBe(401)
  const login = await handle(
    request({ action: 'login', password: 'test-only-password' }),
  )
  cookie = login.headers.get('set-cookie')!.split(';')[0]
  expect((await handle(request({ action: 'logout' }))).status).toBe(200)
  expect((await handle(request())).status).toBe(401)
})
it('throttles repeated login attempts', async () => {
  let response: Response | undefined
  for (let i = 0; i < 11; i++)
    response = await handle(request({ action: 'login', password: 'wrong' }))
  expect(response?.status).toBe(429)
})
