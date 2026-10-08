import { z } from 'zod'

export function normalizeUrl(value: string) {
  const url = new URL(value)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error('Use an HTTP(S) URL without credentials')
  url.hash = ''
  const instagram = [
    'instagram.com',
    'www.instagram.com',
    'm.instagram.com',
  ].includes(url.hostname.toLowerCase())
  const match = instagram
    ? url.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/)
    : null
  if (match)
    return {
      canonicalUrl: `https://www.instagram.com/${match[1]}/${match[2]}/`,
      source: 'instagram' as const,
      sourceId: match[2],
    }
  return { canonicalUrl: url.href, source: 'web' as const, sourceId: null }
}

export const ingestionInput = z
  .object({
    url: z
      .string()
      .trim()
      .min(1)
      .max(4096)
      .refine((value) => {
        try {
          normalizeUrl(value)
          return true
        } catch {
          return false
        }
      }, 'Use a valid HTTP(S) URL without credentials'),
    title: z.string().trim().max(500).optional(),
    notes: z.string().max(20000).optional(),
    savedAt: z.iso.datetime({ offset: true }).optional(),
  })
  .strict()
export type IngestionInput = z.infer<typeof ingestionInput>
