import { readFile, open } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { hashPassword } from '../src/services/auth/password.server'

const env = await readFile('.env', 'utf8')
if (/^OWNER_PASSWORD_HASH=/m.test(env)) {
  console.log(
    'Preserved existing owner password. Local credentials are in .local-login if generated here.',
  )
} else {
  const password = randomBytes(18).toString('base64url')
  const credentials = await open('.local-login', 'wx', 0o600)
  try {
    await credentials.writeFile(`${password}\n`)
  } finally {
    await credentials.close()
  }
  const file = await open('.env', 'a', 0o600)
  try {
    await file.writeFile(`\nOWNER_PASSWORD_HASH=${hashPassword(password)}\n`)
  } finally {
    await file.close()
  }
  console.log(
    'Owner login configured. Read the private .local-login file to sign in; keep it out of Git.',
  )
}
