import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  bigint,
  primaryKey,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
export const savedItems = pgTable(
  'saved_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    originalUrl: text('original_url').notNull(),
    canonicalUrl: text('canonical_url').notNull(),
    source: text('source').notNull(),
    sourceId: text('source_id'),
    title: text('title'),
    notes: text('notes'),
    contentType: text('content_type'),
    creator: text('creator'),
    caption: text('caption'),
    sourceMetadata: jsonb('source_metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    savedAt: timestamp('saved_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: createdAt(),
    archiveStatus: text('archive_status').notNull().default('pending'),
  },
  (t) => [
    uniqueIndex('items_canonical_url_unique').on(t.canonicalUrl),
    check(
      'items_archive_status_valid',
      sql`${t.archiveStatus} IN ('pending','fetching','archived','partial','unavailable','failed')`,
    ),
  ],
)
export const archivedAssets = pgTable(
  'archived_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => savedItems.id, { onDelete: 'cascade' }),
    bucket: text('bucket').notNull(),
    objectKey: text('object_key').notNull(),
    originalUrl: text('original_url'),
    role: text('role').notNull(),
    mimeType: text('mime_type').notNull(),
    byteSize: bigint('byte_size', { mode: 'number' }).notNull(),
    sha256: text('sha256').notNull(),
    position: integer('position').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('assets_object_unique').on(t.bucket, t.objectKey),
    check('assets_size_nonnegative', sql`${t.byteSize} >= 0`),
    check('assets_sha256_valid', sql`${t.sha256} ~ '^[a-f0-9]{64}$'`),
  ],
)
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
})
export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: createdAt(),
})
export const itemTags = pgTable(
  'item_tags',
  {
    itemId: uuid('item_id')
      .notNull()
      .references(() => savedItems.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.itemId, t.tagId] })],
)
export const itemCollections = pgTable(
  'item_collections',
  {
    itemId: uuid('item_id')
      .notNull()
      .references(() => savedItems.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.itemId, t.collectionId] })],
)
export const itemMetadata = pgTable(
  'item_metadata',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => savedItems.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: jsonb('value').$type<unknown>().notNull(),
    provenance: text('provenance').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    check(
      'metadata_provenance_valid',
      sql`${t.provenance} IN ('user','imported','instagram','ai')`,
    ),
  ],
)
export type SavedItem = typeof savedItems.$inferSelect

export const ownerSessions = pgTable('owner_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: createdAt(),
})
