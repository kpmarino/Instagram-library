import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const skipped = new Set([
  'node_modules',
  '.git',
  'dist',
  '.worktrees',
  '.tanstack',
  '.output',
  '.local-tools',
])
async function collect(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue
    const filename = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...(await collect(filename)))
    else if (entry.name.endsWith('.md')) result.push(filename)
  }
  return result
}
let broken = 0
const files = await collect(root)
for (const filename of files) {
  if (filename.endsWith('ADR_TEMPLATE.md')) continue
  const markdown = (await readFile(filename, 'utf8')).replace(
    /^```[\s\S]*?^```\s*$/gm,
    '',
  )
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split(/\s+"/)[0].replace(/^<|>$/g, '').split('#')[0]
    if (!target || /^[a-z][a-z\d+.-]*:/i.test(target) || target.includes('['))
      continue
    try {
      await access(
        path.resolve(path.dirname(filename), decodeURIComponent(target)),
      )
    } catch {
      console.error(`${path.relative(root, filename)}: missing ${target}`)
      broken++
    }
  }
}
if (broken) process.exitCode = 1
else
  console.log(
    `Local Markdown targets valid across ${files.length} files (fragments/external URLs not checked).`,
  )
