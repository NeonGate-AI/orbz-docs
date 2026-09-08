#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
node "$ROOT/scripts/check-release-content.ts" "$ROOT"
node - "$ROOT" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const root = process.argv[2]
const content = path.join(root, 'content')
const files = []
function walk(dir) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p)
    else if (/\.(md|mdx)$/.test(ent.name)) files.push(p)
  }
}
walk(content)
function routeFor(file) {
  let rel = path.relative(content, file).replaceAll(path.sep, '/').replace(/\.(md|mdx)$/, '')
  rel = rel.replace(/(^|\/)index$/, '$1').replace(/\/$/, '')
  return rel ? '/' + rel : '/'
}
const routes = new Set(files.map(routeFor))
let failures = 0
function fail(msg){ failures++; console.error('content FAIL: ' + msg) }
for (const file of files) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/')
  const text = fs.readFileSync(file, 'utf8')
  const fm = text.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) { fail(`${rel} missing frontmatter`); continue }
  const title = fm[1].match(/^title:\s*(.+)$/m)?.[1]?.trim()
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim()
  if (!title) fail(`${rel} missing title`)
  if (!desc || desc.length < 30) fail(`${rel} needs a useful description (>=30 chars)`)
  const links = [...text.matchAll(/(?:href=|\]\()(["']?)(\/[A-Za-z0-9_./-]*)(?:\1|\))/g)].map(m => m[2])
  for (const href of links) {
    if (href.startsWith('/_') || href.includes('#')) continue
    const normalized = href.length > 1 ? href.replace(/\/$/, '') : '/'
    if (!routes.has(normalized)) fail(`${rel} links to missing internal route ${href}`)
  }
}
if (failures) process.exit(1)
console.log(`content PASS (${files.length} pages)`)
NODE
