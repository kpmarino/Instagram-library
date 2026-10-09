import { createHash, randomBytes } from 'node:crypto'
import { eq, gt, lt, and } from 'drizzle-orm'
import { z } from 'zod'
import { ownerSessions } from '../../db/schema'
import type { getDb } from '../../db/client.server'
import { verifyPassword } from './password.server'
import { saveItem } from '../ingestion/save-item'
import { listItems, editItem } from '../library/items.server'

const COOKIE = 'library_session'
const SESSION_SECONDS = 7 * 24 * 60 * 60
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex')
const cookieToken = (request: Request) =>
  request.headers
    .get('cookie')
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1) ?? ''
const sessionCookie = (request: Request, token: string, maxAge: number) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`
function json(body: unknown, status = 200, cookie?: string) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...(cookie ? { 'Set-Cookie': cookie } : {}),
    },
  })
}

// Single-owner process-wide throttle. A shared limiter is required before multi-process deployment.
let loginWindow = { start: 0, attempts: 0 }
export async function handleLibrary(
  request: Request,
  db: () => ReturnType<typeof getDb>,
  passwordHash: string | undefined,
) {
  try {
    if (!passwordHash)
      return json(
        { error: 'Owner login is not configured. Run npm run auth:setup.' },
        503,
      )
    if (
      request.method !== 'GET' &&
      request.headers.get('origin') !== new URL(request.url).origin
    )
      return json({ error: 'Request origin rejected.' }, 403)
    let body: Record<string, unknown> = {}
    if (request.method !== 'GET') {
      if (!request.headers.get('content-type')?.startsWith('application/json'))
        return json({ error: 'Use JSON.' }, 415)
      const reader = request.body?.getReader()
      const chunks: Uint8Array[] = []
      let size = 0
      if (reader)
        while (true) {
          const part = await reader.read()
          if (part.done) break
          size += part.value.byteLength
          if (size > 32768) {
            await reader.cancel()
            return json({ error: 'Request is too large.' }, 413)
          }
          chunks.push(part.value)
        }
      try {
        body = JSON.parse(Buffer.concat(chunks).toString())
      } catch {
        return json({ error: 'Invalid JSON.' }, 400)
      }
      if (!body || typeof body !== 'object' || Array.isArray(body))
        return json({ error: 'Invalid request.' }, 400)
    }
    if (body.action === 'login') {
      const now = Date.now()
      if (now - loginWindow.start >= 60000)
        loginWindow = { start: now, attempts: 0 }
      if (++loginWindow.attempts > 10)
        return json({ error: 'Too many attempts. Try again in a minute.' }, 429)
      if (
        typeof body.password !== 'string' ||
        body.password.length > 1024 ||
        !verifyPassword(body.password, passwordHash)
      )
        return json({ error: 'Incorrect password.' }, 401)
      const token = randomBytes(32).toString('hex')
      const database = db()
      await database
        .delete(ownerSessions)
        .where(lt(ownerSessions.expiresAt, new Date()))
      await database.insert(ownerSessions).values({
        tokenHash: digest(token),
        expiresAt: new Date(now + SESSION_SECONDS * 1000),
      })
      return json(
        { authenticated: true },
        200,
        sessionCookie(request, token, SESSION_SECONDS),
      )
    }
    const token = cookieToken(request)
    if (!/^[a-f0-9]{64}$/.test(token))
      return json({ error: 'Sign in to continue.' }, 401)
    const database = db()
    const [session] = await database
      .select()
      .from(ownerSessions)
      .where(
        and(
          eq(ownerSessions.tokenHash, digest(token)),
          gt(ownerSessions.expiresAt, new Date()),
        ),
      )
      .limit(1)
    if (!session) return json({ error: 'Sign in to continue.' }, 401)
    if (request.method === 'GET') {
      const url = new URL(request.url)
      const query = z
        .string()
        .max(200)
        .parse(url.searchParams.get('q') ?? '')
      const page = z.coerce
        .number()
        .int()
        .min(0)
        .max(10000)
        .parse(url.searchParams.get('page') ?? 0)
      return json(await listItems(database, query, page))
    }
    if (body.action === 'logout') {
      await database
        .delete(ownerSessions)
        .where(eq(ownerSessions.tokenHash, digest(token)))
      return json({ authenticated: false }, 200, sessionCookie(request, '', 0))
    }
    if (body.action === 'capture') {
      const result = await saveItem(database, body.input)
      return json({ created: result.created }, result.created ? 201 : 200)
    }
    if (body.action === 'edit') {
      const item = await editItem(database, body.input)
      return item
        ? json({ saved: true })
        : json({ error: 'Link no longer exists.' }, 404)
    }
    return json({ error: 'Unknown action.' }, 400)
  } catch (error) {
    if (error instanceof z.ZodError)
      return json({ error: error.issues[0]?.message ?? 'Invalid input.' }, 400)
    console.error('Library request failed')
    return json({ error: 'Unable to access the library. Try again.' }, 500)
  }
}
