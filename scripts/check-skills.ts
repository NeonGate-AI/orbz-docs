import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] || '.')
const skills = resolve(root, '.agents/skills')
const catalog = readFileSync(resolve(skills, 'readme.md'), 'utf8')
const workflow = readFileSync(
  resolve(root, '.agents/specs/workflow.md'),
  'utf8'
)
const required = [
  'accessibility',
  'best-practices',
  'code-review',
  'context-engineering',
  'core-web-vitals',
  'documentation-and-adrs',
  'frontend-ui-engineering',
  'implement',
  'performance',
  'seo',
  'spec-driven-development',
  'tdd',
  'to-spec',
  'to-tickets',
  'web-quality-audit',
  'grilling',
  'grill-me',
  'writing-for-agents',
  'harness-maintenance'
]
let failures = 0
const bad = (file: string, message: string) => {
  console.error(`skills FAIL: ${file}: ${message}`)
  failures++
}
for (const name of required) {
  if (!existsSync(resolve(skills, name, 'SKILL.md')))
    bad(name, 'required procedure missing')
}
for (const entry of readdirSync(skills, { withFileTypes: true }).filter(
  (entry) => entry.isDirectory()
)) {
  const directory = resolve(skills, entry.name)
  const path = resolve(directory, 'SKILL.md')
  if (!existsSync(path)) {
    bad(entry.name, 'missing SKILL.md')
    continue
  }
  const text = readFileSync(path, 'utf8')
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ''
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1].trim()
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1].trim()
  if (name !== entry.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name || ''))
    bad(entry.name, 'activation name must match directory')
  if (!description || description.length < 20)
    bad(entry.name, 'activation description missing or uninformative')
  if (
    !existsSync(resolve(directory, 'README.md')) &&
    !existsSync(resolve(directory, 'readme.md'))
  )
    bad(entry.name, 'purpose README missing')
  if (
    !catalog.includes(`\`${entry.name}\``) &&
    !catalog.includes(`(${entry.name}/SKILL.md)`)
  )
    bad(entry.name, 'missing skill catalog entry')
  for (const link of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = link[1].split('#')[0]
    if (!target || /^(https?:|mailto:)/.test(target)) continue
    const resolved = resolve(dirname(path), target)
    if (relative(root, resolved).startsWith('..') || !existsSync(resolved))
      bad(entry.name, 'broken or outside-repository local reference')
  }
}
for (const name of ['to-spec', 'implement', 'tdd', 'code-review']) {
  if (!workflow.includes(name))
    bad('workflow.md', `delivery workflow does not route ${name}`)
}
for (const name of [
  'readme',
  'docs',
  'harness-improvement',
  'regression-fix',
  'review',
  'deployment'
]) {
  if (!existsSync(resolve(root, '.agents/workflows', `${name}.md`)))
    bad('workflows', 'required reusable sequence missing')
}
if (failures) process.exit(1)
console.log('skills PASS (activation, catalog, references and workflows)')
