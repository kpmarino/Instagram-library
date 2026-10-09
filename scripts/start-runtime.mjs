import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'
const nativeBin = path.resolve('.local-tools/colima-lima/bin')
const command =
  process.platform === 'darwin' && existsSync(path.join(nativeBin, 'colima'))
    ? path.join(nativeBin, 'colima')
    : 'colima'
const env =
  command === 'colima'
    ? process.env
    : { ...process.env, PATH: `${nativeBin}:${process.env.PATH}` }
const child = spawn(command, ['start'], { env, stdio: 'inherit' })
child.on('error', () => {
  console.error(
    'Colima is unavailable. Start a compatible Docker runtime before npm run db:up.',
  )
  process.exitCode = 1
})
child.on('exit', (code) => {
  process.exitCode = code ?? 1
})
