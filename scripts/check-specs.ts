import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] || '.')
const specs = resolve(root, '.agents/specs')
const catalog = readFileSync(resolve(specs, 'readme.md'), 'utf8')
const ids = new Set<string>()
const filenames = new Set<string>()
let failures = 0
function bad(file: string, message: string) {
  console.error(`specs FAIL: ${file}: ${message}`)
  failures++
}

for (const file of readdirSync(specs).filter((name) =>
  /^\d.*\.spec\.md$/.test(name)
)) {
  filenames.add(file)
  if (!/^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*\.spec\.md$/.test(file))
    bad(file, 'invalid semantic filename')
  const text = readFileSync(resolve(specs, file), 'utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) {
    bad(file, 'missing YAML frontmatter')
    continue
  }
  const fields: Record<string, string> = {}
  const lists: Record<string, string[]> = {}
  let key = ''
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-z][a-z-]*):(?:\s*(.*))?$/)
    if (field) {
      key = field[1]
      if (Object.hasOwn(fields, key))
        bad(file, `duplicate frontmatter field ${key}`)
      fields[key] = (field[2] || '').trim().replace(/^(['"])(.*)\1$/, '$2')
      lists[key] = []
    } else {
      const item = line.match(/^\s+-\s+(.+)$/)
      if (item && key)
        lists[key].push(item[1].trim().replace(/^(['"])(.*)\1$/, '$2'))
      else if (line.trim() && !/^\s*#/.test(line))
        bad(
          file,
          'unsupported frontmatter; use scalar fields and indented lists'
        )
    }
  }
  for (const field of [
    'id',
    'title',
    'type',
    'status',
    'mode',
    'created',
    'updated',
    'owners',
    'targets',
    'context',
    'rules',
    'adrs',
    'skills',
    'evidence'
  ]) {
    if (!Object.hasOwn(fields, field))
      bad(file, `missing frontmatter field ${field}`)
  }
  const id = fields.id || ''
  if (!/^SPEC-\d{3}$/.test(id)) bad(file, 'invalid spec identity')
  if (id !== `SPEC-${file.slice(0, 3)}`)
    bad(file, 'spec identity must match the stable filename prefix')
  if (ids.has(id)) bad(file, 'duplicate spec identity')
  ids.add(id)
  if (
    !/^(draft|ready|in-progress|implemented|superseded|retired)$/.test(
      fields.status || ''
    )
  )
    bad(file, 'invalid lifecycle status')
  if (!/^(prospective|retrospective)$/.test(fields.mode || ''))
    bad(file, 'invalid evidence mode')
  for (const date of ['created', 'updated']) {
    const value = fields[date] || ''
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    )
      bad(file, `invalid ${date} date`)
  }
  if (fields.updated < fields.created)
    bad(file, 'updated date predates creation')
  for (const field of [
    'owners',
    'targets',
    'context',
    'rules',
    'skills',
    'evidence'
  ]) {
    if (!lists[field]?.length)
      bad(file, `${field} must contain at least one item`)
  }
  for (const field of ['context', 'rules', 'adrs', 'skills', 'evidence']) {
    for (const value of lists[field] || []) {
      if (value === 'none' && field === 'adrs') continue
      if (
        field === 'evidence' &&
        (value === 'pending' || /^(https:\/\/|git:|command:)/.test(value))
      )
        continue
      const target = resolve(root, value)
      if (
        isAbsolute(value) ||
        relative(root, target).startsWith('..') ||
        !existsSync(target)
      )
        bad(file, `${field} references a missing or outside-repository path`)
    }
  }
  const rows = catalog
    .split('\n')
    .filter((line) => line.startsWith('|') && line.includes(`(${file})`))
  if (rows.length !== 1) bad(file, 'spec must have exactly one catalog row')
  else {
    const cells = rows[0].split('|').map((value) => value.trim())
    if (!cells.includes(id) || !cells.includes(fields.status))
      bad(file, 'catalog identity/status disagree with frontmatter')
  }
  if (fields.status === 'implemented') {
    const acceptance =
      text.match(
        /^## Acceptance Criteria\s*\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/im
      )?.[1] || ''
    if (!/^- \[[xX]\]\s+/m.test(acceptance))
      bad(file, 'implemented spec has no checked acceptance criteria')
    if (/^- \[ \]\s+/m.test(acceptance))
      bad(file, 'implemented spec has unchecked acceptance criteria')
    if (
      !lists.evidence?.length ||
      lists.evidence.some((value) => /^(pending|todo|tbd)(?:\b|:)/i.test(value))
    )
      bad(file, 'implemented spec has pending evidence')
  }
}
for (const link of catalog.matchAll(/\]\((\d[^)]*\.spec\.md)\)/g)) {
  if (!filenames.has(link[1]))
    bad('readme.md', 'catalog references a missing spec')
}
if (!filenames.size) bad('readme.md', 'no numbered specs found')
if (failures) process.exit(1)
console.log(
  `specs PASS (${filenames.size} contracts, catalog, references and evidence)`
)
