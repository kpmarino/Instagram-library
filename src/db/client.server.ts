import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
let db: ReturnType<typeof drizzle<typeof schema>> | undefined
export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  return (db ??= drizzle(
    new Pool({ connectionString: process.env.DATABASE_URL, max: 5 }),
    { schema },
  ))
}
