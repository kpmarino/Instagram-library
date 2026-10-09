import { open } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
try {
  const file = await open('.env', 'wx', 0o600)
  try {
    await file.writeFile(
      `DATABASE_URL=postgresql://library:library@127.0.0.1:5432/library\nINGESTION_API_TOKEN=${randomBytes(32).toString('hex')}\n`,
    )
  } finally {
    await file.close()
  }
  console.log('Created private .env with a random capture token.')
} catch (error) {
  if (error.code !== 'EEXIST') throw error
  console.log('Preserved existing .env; no configuration was overwritten.')
}
