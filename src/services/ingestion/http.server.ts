import { timingSafeEqual, createHash } from 'node:crypto'
import { ZodError } from 'zod'
import type { SavedItem } from '../../db/schema'
type Save = (input: unknown) => Promise<{ item: SavedItem; created: boolean }>
const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
export async function handleIngestion(
  request: Request,
  save: Save,
  token: string | undefined,
) {
  if (!token || token === 'replace-with-a-long-random-token')
    return json({ error: 'Ingestion is not configured' }, 503)
  const expected = createHash('sha256').update(`Bearer ${token}`).digest()
  const received = createHash('sha256')
    .update(request.headers.get('authorization') ?? '')
    .digest()
  if (!timingSafeEqual(expected, received))
    return json({ error: 'Unauthorized' }, 401)
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  )
    return json({ error: 'Expected application/json' }, 415)
  // Limit streamed bytes, including requests without Content-Length.
  const reader = request.body?.getReader()
  if (!reader) return json({ error: 'Expected JSON body' }, 400)
  let size = 0
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > 32768) {
      await reader.cancel()
      return json({ error: 'Body too large' }, 413)
    }
    chunks.push(value)
  }
  let body: unknown
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }
  try {
    const result = await save(body)
    return json(result, result.created ? 201 : 200)
  } catch (error) {
    if (error instanceof ZodError)
      return json({ error: 'Invalid input', issues: error.issues }, 400)
    console.error('Ingestion persistence failed')
    return json({ error: 'Unable to save item' }, 503)
  }
}
