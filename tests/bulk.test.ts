import { it, expect, vi } from 'vitest'
import { parseBulkLinks } from '../src/domain/items/bulk'
import { bulkSave } from '../src/services/ingestion/bulk-save'

it('parses plain, bulleted, numbered, Markdown and angle-bracket links with line numbers', () => {
  const result = parseBulkLinks(
    '\nhttps://example.org/plain\r\n- https://example.org/bullet\n2. https://example.org/number\n• [A link](https://example.org/markdown?q=1)\n<https://example.org/angle>\n',
  )
  expect(result.map((r) => r.url)).toEqual([
    'https://example.org/plain',
    'https://example.org/bullet',
    'https://example.org/number',
    'https://example.org/markdown?q=1',
    'https://example.org/angle',
  ])
  expect(result.map((r) => r.line)).toEqual([2, 3, 4, 5, 6])
  expect(result.every((r) => !r.error)).toBe(true)
})
it('reports invalid lines rather than silently dropping them or extracting credentials', () => {
  const results = parseBulkLinks(
    'javascript:alert(1)\nhttps://user:secret@example.org/\nAI introductory prose\nhttps://example.org/a https://example.org/b\nhttps://example.org/valid',
  )
  expect(results.filter((r) => r.error)).toHaveLength(4)
  expect(results[4].error).toBeUndefined()
})
it('rejects empty, too many and oversized batches before persistence', async () => {
  const save = vi.fn()
  for (const text of [
    ' \n',
    Array.from({ length: 101 }, () => 'https://example.org').join('\n'),
    'a'.repeat(20001),
  ]) {
    await expect(bulkSave(text, save)).rejects.toThrow()
  }
  expect(save).not.toHaveBeenCalled()
  expect(
    parseBulkLinks(
      Array.from({ length: 100 }, () => 'https://example.org').join('\n'),
    ),
  ).toHaveLength(100)
})
it('isolates failed entries, reports outcomes and supports a safe retry', async () => {
  const save = vi
    .fn()
    .mockResolvedValueOnce({ created: true })
    .mockRejectedValueOnce(new Error('private DB details'))
    .mockResolvedValueOnce({ created: false })
  const result = await bulkSave(
    'https://example.org/a\nhttps://example.org/b\ninvalid\nhttps://example.org/a',
    save,
  )
  expect(result.counts).toEqual({
    saved: 1,
    duplicate: 1,
    invalid: 1,
    failed: 1,
  })
  expect(result.results.map((r) => r.status)).toEqual([
    'saved',
    'failed',
    'invalid',
    'duplicate',
  ])
  expect(JSON.stringify(result)).not.toContain('private DB details')
  expect(save.mock.calls.map((call) => call[0])).toEqual([
    { url: 'https://example.org/a' },
    { url: 'https://example.org/b' },
    { url: 'https://example.org/a' },
  ])
  const retry = await bulkSave(
    result.results
      .filter((r) => r.status === 'failed')
      .map((r) => r.url)
      .join('\n'),
    async () => ({ created: true }),
  )
  expect(retry.counts.saved).toBe(1)
})
