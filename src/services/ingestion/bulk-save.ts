import { parseBulkLinks, type BulkResult } from '../../domain/items/bulk'

export async function bulkSave(
  raw: unknown,
  save: (input: { url: string }) => Promise<{ created: boolean }>,
) {
  const entries = parseBulkLinks(raw)
  const results: BulkResult[] = []
  // Each item commits independently. Retrying an interrupted batch is duplicate-safe.
  for (const entry of entries) {
    if (entry.error) {
      results.push({ ...entry, status: 'invalid' })
      continue
    }
    try {
      const saved = await save({ url: entry.url })
      results.push({ ...entry, status: saved.created ? 'saved' : 'duplicate' })
    } catch {
      results.push({
        ...entry,
        status: 'failed',
        error: 'Could not save this link. Retry it.',
      })
    }
  }
  return {
    results,
    counts: {
      saved: results.filter((r) => r.status === 'saved').length,
      duplicate: results.filter((r) => r.status === 'duplicate').length,
      invalid: results.filter((r) => r.status === 'invalid').length,
      failed: results.filter((r) => r.status === 'failed').length,
    },
  }
}
