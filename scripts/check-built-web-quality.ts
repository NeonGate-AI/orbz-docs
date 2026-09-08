import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { inspectRenderedPage } from './rendered-web-quality.compute.ts'

const root = resolve(process.argv[2] || '.')
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orbz.site')
  .origin
const content = join(root, 'content')
const failures: string[] = []
let pages = 0

function inspectDirectory(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) {
      inspectDirectory(file)
      continue
    }
    if (!/\.mdx?$/.test(entry.name)) continue
    const path = relative(content, file)
      .replaceAll('\\', '/')
      .replace(/\.mdx?$/, '')
      .replace(/(^|\/)index$/, '')
    const route = path ? `/${path}` : '/'
    const output = join(root, '.next/server/app', `${path || 'index'}.html`)
    pages++
    if (!existsSync(output)) {
      failures.push(
        `${route}: generated HTML missing; run the production build`
      )
      continue
    }
    failures.push(
      ...inspectRenderedPage(readFileSync(output, 'utf8'), route, origin).map(
        (failure) => `${route}: ${failure}`
      )
    )
  }
}

if (existsSync(content)) inspectDirectory(content)
if (!pages) failures.push('no authored documentation pages found')

for (const [name, size] of [
  ['icon.png', 96],
  ['apple-icon.png', 180]
] as const) {
  const file = join(root, 'app', name)
  if (!existsSync(file)) {
    failures.push(`app/${name}: icon source missing`)
    continue
  }
  const bytes = readFileSync(file)
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  if (
    bytes.length < 24 ||
    !bytes.subarray(0, 8).equals(signature) ||
    bytes.toString('ascii', 12, 16) !== 'IHDR' ||
    bytes.readUInt32BE(16) !== size ||
    bytes.readUInt32BE(20) !== size
  ) {
    failures.push(`app/${name}: expected a ${size} by ${size} PNG`)
  }
}
const favicon = join(root, 'app/favicon.ico')
if (!existsSync(favicon)) {
  failures.push('app/favicon.ico: icon source missing')
} else {
  const bytes = readFileSync(favicon)
  if (
    bytes.length < 22 ||
    bytes.readUInt32LE(0) !== 65536 ||
    bytes.readUInt16LE(4) < 1
  ) {
    failures.push('app/favicon.ico: invalid ICO signature or empty directory')
  }
}

if (failures.length) {
  for (const failure of failures)
    console.error(`built-web-quality FAIL: ${failure}`)
  process.exit(1)
}
console.log(
  `built-web-quality PASS (${pages} generated pages, metadata, icons and accessible-name contracts; no WCAG or field CWV claim)`
)
