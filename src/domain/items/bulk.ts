import { z } from 'zod'
import { ingestionInput } from './ingestion'

export const MAX_BULK_LINKS = 100
export const MAX_BULK_TEXT = 20000
export type BulkEntry = { line: number; url: string; error?: string }
export type BulkResult = BulkEntry & {
  status: 'saved' | 'duplicate' | 'invalid' | 'failed'
}
export type BulkReport = {
  results: BulkResult[]
  counts: Record<BulkResult['status'], number>
}

export function parseBulkLinks(raw: unknown): BulkEntry[] {
  const parsedText = z
    .string()
    .max(MAX_BULK_TEXT, 'Paste no more than 20,000 characters.')
    .safeParse(raw)
  if (!parsedText.success)
    throw new Error(
      parsedText.error.issues[0]?.message ?? 'Paste a list of links.',
    )
  const text = parsedText.data
  const lines = text
    .split(/\r?\n/)
    .map((value, index) => ({ value: value.trim(), line: index + 1 }))
    .filter((entry) => entry.value)
  if (!lines.length) throw new Error('Paste at least one link.')
  if (lines.length > MAX_BULK_LINKS)
    throw new Error('Import up to 100 links at a time.')
  return lines.map(({ value, line }) => {
    const unlisted = value.replace(/^(?:[-*•]\s+|\d+[.)]\s+)/, '')
    const markdown = unlisted.match(/^\[[^\]]*\]\(([^\s]+)\)$/)
    const url = markdown ? markdown[1] : unlisted.replace(/^<([^<>]+)>$/, '$1')
    const parsed = ingestionInput.safeParse({ url })
    return parsed.success && !/\s/.test(url)
      ? { line, url: parsed.data.url }
      : {
          line,
          url: value,
          error: 'Use one valid HTTP(S) URL per line, without credentials.',
        }
  })
}
