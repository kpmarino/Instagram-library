import { desc, eq, or, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { savedItems } from '../../db/schema'
import type { getDb } from '../../db/client.server'

export const editInput = z
  .object({
    id: z.uuid(),
    title: z.string().trim().max(500),
    notes: z.string().max(20000),
  })
  .strict()
export async function listItems(
  db: ReturnType<typeof getDb>,
  query: string,
  page: number,
) {
  const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`
  const where = query
    ? or(
        ilike(savedItems.title, pattern),
        ilike(savedItems.notes, pattern),
        ilike(savedItems.canonicalUrl, pattern),
      )
    : undefined
  const rows = await db
    .select({
      id: savedItems.id,
      canonicalUrl: savedItems.canonicalUrl,
      title: savedItems.title,
      notes: savedItems.notes,
      savedAt: savedItems.savedAt,
    })
    .from(savedItems)
    .where(where)
    .orderBy(desc(savedItems.savedAt), desc(savedItems.id))
    .limit(26)
    .offset(page * 25)
  return { items: rows.slice(0, 25), hasMore: rows.length > 25 }
}
export async function editItem(db: ReturnType<typeof getDb>, raw: unknown) {
  const { id, title, notes } = editInput.parse(raw)
  const [item] = await db
    .update(savedItems)
    .set({ title, notes })
    .where(eq(savedItems.id, id))
    .returning()
  return item
}
