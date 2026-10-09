import { describe, it, expect } from 'vitest'
import { ingestionInput, normalizeUrl } from '../src/domain/items/ingestion'
describe('URL capture', () => {
  it('canonicalizes Instagram post tracking links', () => {
    expect(
      normalizeUrl('http://m.instagram.com/reel/Ab_12/?igsh=abc#x'),
    ).toEqual({
      canonicalUrl: 'https://www.instagram.com/reel/Ab_12/',
      source: 'instagram',
      sourceId: 'Ab_12',
    })
  })
  it('preserves meaningful query parameters on generic URLs', () => {
    expect(
      normalizeUrl('https://example.org/article?id=5#section').canonicalUrl,
    ).toBe('https://example.org/article?id=5')
    expect(normalizeUrl('https://instagram.com.evil.test/p/ABC').source).toBe(
      'web',
    )
  })
  it.each([
    'javascript:alert(1)',
    'file:///tmp/x',
    'https://user:pass@example.org',
    'no-url',
  ])('rejects invalid capture %s', (url) => {
    expect(ingestionInput.safeParse({ url }).success).toBe(false)
  })
  it('rejects unknown fields and invalid dates', () => {
    expect(
      ingestionInput.safeParse({ url: 'https://example.org', owner: 'someone' })
        .success,
    ).toBe(false)
    expect(
      ingestionInput.safeParse({
        url: 'https://example.org',
        savedAt: 'yesterday',
      }).success,
    ).toBe(false)
  })
})
