import { describe, it, expect, vi } from 'vitest'
import { handleIngestion } from '../src/services/ingestion/http.server'
import { ingestionInput } from '../src/domain/items/ingestion'
import type { SavedItem } from '../src/db/schema'
const token = 'test-token'
const request = (
  body: string,
  auth = 'Bearer test-token',
  contentType = 'application/json',
) =>
  new Request('http://localhost/api/v1/items', {
    method: 'POST',
    headers: { authorization: auth, 'content-type': contentType },
    body,
  })
describe('ingestion HTTP boundary', () => {
  it('fails closed when unconfigured and rejects unauthorized requests before persistence', async () => {
    const save = vi.fn()
    expect((await handleIngestion(request('{}'), save, undefined)).status).toBe(
      503,
    )
    expect(
      (await handleIngestion(request('{}', 'wrong'), save, token)).status,
    ).toBe(401)
    expect(save).not.toHaveBeenCalled()
  })
  it('rejects malformed, oversized, unsupported and invalid input', async () => {
    const save = vi.fn(async (input: unknown) => {
      ingestionInput.parse(input)
      return { item: {} as SavedItem, created: true }
    })
    expect((await handleIngestion(request('{'), save, token)).status).toBe(400)
    expect(
      (await handleIngestion(request('x'.repeat(32769)), save, token)).status,
    ).toBe(413)
    expect(
      (
        await handleIngestion(
          request('{}', 'Bearer test-token', 'text/plain'),
          save,
          token,
        )
      ).status,
    ).toBe(415)
    expect(save).not.toHaveBeenCalled()
    expect((await handleIngestion(request('{}'), save, token)).status).toBe(400)
  })
  it('returns create and duplicate responses and disables caching', async () => {
    for (const created of [true, false]) {
      const response = await handleIngestion(
        request('{}'),
        async () => ({ item: { id: 'one' } as SavedItem, created }),
        token,
      )
      expect(response.status).toBe(created ? 201 : 200)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(await response.json()).toEqual({ item: { id: 'one' }, created })
    }
  })
  it('does not expose database errors', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const response = await handleIngestion(
        request('{}'),
        async () => {
          throw new Error('postgres secret connection')
        },
        token,
      )
      expect(response.status).toBe(503)
      expect(await response.text()).not.toContain('secret')
    } finally {
      spy.mockRestore()
    }
  })
})
