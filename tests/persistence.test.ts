import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite-pgvector'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { eq } from 'drizzle-orm'
import * as schema from '../src/db/schema'
import type { getDb } from '../src/db/client.server'
import { saveItem } from '../src/services/ingestion/save-item'
import { handleIngestion } from '../src/services/ingestion/http.server'
const pg = new PGlite({ extensions: { vector } })
const db = drizzle(pg, { schema })
// Same Drizzle PostgreSQL schema and query builders, with an embedded PostgreSQL test driver.
const save = (input: unknown) =>
  saveItem(db as unknown as ReturnType<typeof getDb>, input)
beforeAll(async () => {
  await migrate(db, { migrationsFolder: './src/db/migrations' })
}, 30000)
afterAll(async () => {
  await pg.close()
})
describe('committed PostgreSQL migration and persistence', () => {
  it('enables pgvector and migration is repeatable', async () => {
    await migrate(db, { migrationsFolder: './src/db/migrations' })
    const result = await pg.query<{ distance: number }>(
      "SELECT '[1,2,3]'::vector <-> '[1,2,3]'::vector AS distance",
    )
    expect(result.rows[0].distance).toBe(0)
  })
  it('deduplicates without overwriting user data', async () => {
    const first = await save({
      url: 'https://instagram.com/p/ABC/?igsh=x',
      title: 'Keep me',
      notes: 'My original notes',
    })
    const second = await save({
      url: 'https://www.instagram.com/p/ABC/',
      title: 'Discard this',
    })
    expect(first.created).toBe(true)
    expect(second.created).toBe(false)
    expect(second.item.id).toBe(first.item.id)
    expect(second.item.title).toBe('Keep me')
    expect(second.item.notes).toBe('My original notes')
    expect(second.item.archiveStatus).toBe('pending')
  })
  it('handles concurrent duplicate captures', async () => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        save({ url: 'https://example.org/concurrent' }),
      ),
    )
    expect(results.filter((r) => r.created)).toHaveLength(1)
    expect(new Set(results.map((r) => r.item.id)).size).toBe(1)
  })
  it('captures through the authenticated HTTP boundary into PostgreSQL', async () => {
    const capture = () =>
      handleIngestion(
        new Request('http://localhost/api/v1/items', {
          method: 'POST',
          headers: {
            authorization: 'Bearer integration',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            url: 'https://example.org/http',
            notes: 'Persisted from HTTP',
          }),
        }),
        save,
        'integration',
      )
    const first = await capture()
    expect(first.status).toBe(201)
    const body = await first.json()
    expect(body.item.notes).toBe('Persisted from HTTP')
    const duplicate = await capture()
    expect(duplicate.status).toBe(200)
    expect((await duplicate.json()).item.id).toBe(body.item.id)
  })
  it('stores metadata, taxonomy and asset provenance, cascading item deletion', async () => {
    const { item } = await save({
      url: 'https://example.org/assets',
      savedAt: '2026-10-01T12:00:00Z',
    })
    expect(item.savedAt.toISOString()).toBe('2026-10-01T12:00:00.000Z')
    const [tag] = await db
      .insert(schema.tags)
      .values({ name: 'recipe' })
      .returning()
    const [collection] = await db
      .insert(schema.collections)
      .values({ name: 'Cooking' })
      .returning()
    await db.insert(schema.itemTags).values({ itemId: item.id, tagId: tag.id })
    await db
      .insert(schema.itemCollections)
      .values({ itemId: item.id, collectionId: collection.id })
    await db.insert(schema.itemMetadata).values({
      itemId: item.id,
      key: 'ingredients',
      value: ['salt'],
      provenance: 'user',
    })
    await db.insert(schema.archivedAssets).values({
      itemId: item.id,
      bucket: 'library',
      objectKey: 'originals/test',
      role: 'original',
      mimeType: 'image/jpeg',
      byteSize: 10,
      sha256: 'a'.repeat(64),
    })
    await db.delete(schema.savedItems).where(eq(schema.savedItems.id, item.id))
    expect(await db.select().from(schema.archivedAssets)).toHaveLength(0)
    expect(await db.select().from(schema.itemMetadata)).toHaveLength(0)
    expect(await db.select().from(schema.itemTags)).toHaveLength(0)
    expect(await db.select().from(schema.itemCollections)).toHaveLength(0)
    expect(await db.select().from(schema.tags)).toHaveLength(1)
  })
})
