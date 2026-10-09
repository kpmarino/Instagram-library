import { eq } from 'drizzle-orm'
import { ingestionInput, normalizeUrl } from '../../domain/items/ingestion'
import { savedItems } from '../../db/schema'
import type { getDb } from '../../db/client.server'
export async function saveItem(db: ReturnType<typeof getDb>, raw: unknown) {
  const input = ingestionInput.parse(raw)
  const normalized = normalizeUrl(input.url)
  const [created] = await db
    .insert(savedItems)
    .values({
      originalUrl: input.url,
      ...normalized,
      title: input.title,
      notes: input.notes,
      savedAt: input.savedAt ? new Date(input.savedAt) : undefined,
    })
    .onConflictDoNothing({ target: savedItems.canonicalUrl })
    .returning()
  if (created) return { item: created, created: true }
  const [existing] = await db
    .select()
    .from(savedItems)
    .where(eq(savedItems.canonicalUrl, normalized.canonicalUrl))
    .limit(1)
  if (!existing) throw new Error('Duplicate item could not be read')
  return { item: existing, created: false }
}
