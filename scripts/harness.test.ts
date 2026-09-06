import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'docs-harness-'))
  cpSync(join(root, '.agents'), join(path, '.agents'), { recursive: true })
  const contracts = join(path, '.agents/specs')
  rmSync(contracts, { recursive: true })
  mkdirSync(contracts)
  const record = `---
id: SPEC-901
title: Synthetic valid delivery
type: governance
status: implemented
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - Synthetic owner
targets:
  - fixtures
context:
  - .agents/context/repository.md
rules:
  - .agents/rules/011-spec-driven-development.rule.md
adrs:
  - none
skills:
  - .agents/skills/to-spec/SKILL.md
evidence:
  - .agents/context/repository.md
---

# Fixture

## Acceptance Criteria

- [x] Observable synthetic outcome.

## Failure Behavior

Failure blocks delivery.
`
  const file = join(contracts, '901-synthetic-delivery.spec.md')
  writeFileSync(file, record)
  writeFileSync(
    join(contracts, 'readme.md'),
    '| [901](901-synthetic-delivery.spec.md) | SPEC-901 | implemented | Fixture |\n'
  )
  writeFileSync(
    join(contracts, 'workflow.md'),
    readFileSync(join(root, '.agents/specs/workflow.md'))
  )
  return {
    path,
    file,
    cleanup: () => rmSync(path, { recursive: true, force: true })
  }
}
function audit(
  script: string,
  path: string,
  extra: Record<string, string> = {}
) {
  return spawnSync('sh', [join(root, '.audits', script)], {
    cwd: root,
    env: { ...process.env, DOCS_AUDIT_ROOT: path, ...extra },
    encoding: 'utf8'
  })
}

test('valid completed spec and discovered skills pass the shell audit entrypoints', () => {
  const data = fixture()
  try {
    for (const script of ['specs.audit.sh', 'workflow-skills.audit.sh']) {
      const result = audit(script, data.path)
      assert.equal(result.status, 0, result.stderr)
    }
  } finally {
    data.cleanup()
  }
})

for (const scenario of [
  {
    name: 'unchecked completion',
    from: '- [x]',
    to: '- [ ]',
    expected: 'unchecked acceptance'
  },
  {
    name: 'pending completed evidence',
    from: 'evidence:\n  - .agents/context/repository.md',
    to: 'evidence:\n  - pending',
    expected: 'pending evidence'
  },
  {
    name: 'missing reference',
    from: 'context:\n  - .agents/context/repository.md',
    to: 'context:\n  - .agents/context/missing.md',
    expected: 'missing or outside-repository path'
  },
  {
    name: 'catalog status disagreement',
    from: 'status: implemented',
    to: 'status: in-progress',
    expected: 'catalog identity/status'
  },
  {
    name: 'invalid calendar date',
    from: 'created: 2026-09-06',
    to: 'created: 2026-02-30',
    expected: 'invalid created date'
  }
]) {
  test(`spec audit rejects ${scenario.name}`, () => {
    const data = fixture()
    try {
      writeFileSync(
        data.file,
        readFileSync(data.file, 'utf8').replace(scenario.from, scenario.to)
      )
      const result = audit('specs.audit.sh', data.path)
      assert.notEqual(result.status, 0)
      assert.ok(result.stderr.includes(scenario.expected), result.stderr)
    } finally {
      data.cleanup()
    }
  })
}

test('skill audit rejects metadata that would silently disable discovery', () => {
  const data = fixture()
  try {
    const file = join(data.path, '.agents/skills/grilling/SKILL.md')
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(
        'name: grilling',
        'name: unrelated-name'
      )
    )
    const result = audit('workflow-skills.audit.sh', data.path)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /activation name/)
  } finally {
    data.cleanup()
  }
})

test('spec identity cannot diverge from its filename even when the catalog agrees', () => {
  const data = fixture()
  try {
    writeFileSync(
      data.file,
      readFileSync(data.file, 'utf8').replace('SPEC-901', 'SPEC-902')
    )
    const catalog = join(data.path, '.agents/specs/readme.md')
    writeFileSync(
      catalog,
      readFileSync(catalog, 'utf8').replace('SPEC-901', 'SPEC-902')
    )
    const result = audit('specs.audit.sh', data.path)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /stable filename prefix/)
  } finally {
    data.cleanup()
  }
})

test('skill audit rejects a broken local procedure reference', () => {
  const data = fixture()
  try {
    const file = join(data.path, '.agents/skills/grill-me/SKILL.md')
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(
        '../grilling/SKILL.md',
        '../absent/SKILL.md'
      )
    )
    const result = audit('workflow-skills.audit.sh', data.path)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /broken or outside-repository/)
  } finally {
    data.cleanup()
  }
})

test('public-boundary scan catches candidate editor text without printing its value', () => {
  const data = fixture()
  const privateList = join(tmpdir(), `docs-terms-${process.pid}-${Date.now()}`)
  try {
    spawnSync('git', ['init', '-q', data.path])
    mkdirSync(join(data.path, '.vscode'))
    const value = 'synthetic-protected-identifier'
    writeFileSync(privateList, `${value}\n`)
    writeFileSync(
      join(data.path, '.vscode/settings.json'),
      JSON.stringify({ example: value })
    )
    const result = audit('public-boundary.audit.sh', data.path, {
      DOCS_PRIVATE_TERMS_FILE: privateList
    })
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /\.vscode\/settings.json/)
    assert.ok(!result.stderr.includes(value))
    writeFileSync(
      join(data.path, '.vscode/settings.json'),
      JSON.stringify({ example: 'Synthetic Protected Identifier' })
    )
    const normalized = audit('public-boundary.audit.sh', data.path, {
      DOCS_PRIVATE_TERMS_FILE: privateList
    })
    assert.notEqual(normalized.status, 0)
    writeFileSync(join(data.path, '.vscode/settings.json'), '{}\n')
    const clean = audit('public-boundary.audit.sh', data.path, {
      DOCS_PRIVATE_TERMS_FILE: privateList
    })
    assert.equal(clean.status, 0, clean.stderr)
  } finally {
    data.cleanup()
    rmSync(privateList, { force: true })
  }
})

test('public-boundary scan redacts a protected filename from failure output', () => {
  const data = fixture()
  const privateList = join(tmpdir(), `docs-terms-${process.pid}-${Date.now()}`)
  try {
    spawnSync('git', ['init', '-q', data.path])
    const value = 'synthetic-protected-identifier'
    writeFileSync(privateList, `${value}\n`)
    writeFileSync(join(data.path, `${value}.md`), '# Public fixture\n')
    const result = audit('public-boundary.audit.sh', data.path, {
      DOCS_PRIVATE_TERMS_FILE: privateList
    })
    assert.notEqual(result.status, 0)
    assert.ok(
      !result.stderr.includes(value),
      'failure output must redact the protected filename'
    )
    assert.match(result.stderr, /\[file:[0-9a-f]{12}\]/)
  } finally {
    data.cleanup()
    rmSync(privateList, { force: true })
  }
})

test('public-boundary rejects dangling and valid symlinks while allowing tracked deletions', () => {
  const data = fixture()
  try {
    spawnSync('git', ['init', '-q', data.path])
    const link = join(data.path, 'candidate-link')
    symlinkSync('missing-target', link)
    const dangling = audit('public-boundary.audit.sh', data.path)
    assert.notEqual(dangling.status, 0)
    assert.match(dangling.stderr, /symbolic file/)
    rmSync(link)
    const target = join(data.path, 'public-fixture.md')
    writeFileSync(target, '# Public fixture\n')
    symlinkSync('public-fixture.md', link)
    const validLink = audit('public-boundary.audit.sh', data.path)
    assert.notEqual(validLink.status, 0)
    assert.match(validLink.stderr, /symbolic file/)
    rmSync(link)
    assert.equal(
      spawnSync('git', ['add', '--', 'public-fixture.md'], { cwd: data.path })
        .status,
      0
    )
    rmSync(target)
    const deleted = audit('public-boundary.audit.sh', data.path)
    assert.equal(deleted.status, 0, deleted.stderr)
  } finally {
    data.cleanup()
  }
})

test('Markdown shell entrypoint enforces content metadata with absolute paths', () => {
  const data = fixture()
  try {
    mkdirSync(join(data.path, 'content'))
    const page = join(data.path, 'content', 'example with spaces.mdx')
    writeFileSync(page, '# Missing metadata\n')
    const invalid = spawnSync(
      'sh',
      [join(root, 'scripts/lint-markdown.sh'), page],
      { cwd: data.path, encoding: 'utf8' }
    )
    assert.equal(invalid.status, 1)
    assert.match(invalid.stderr, /title and description/)
    writeFileSync(
      page,
      `---
title: Example
description: Valid fixture.
---

# Example
`
    )
    assert.equal(
      spawnSync('sh', [join(root, 'scripts/lint-markdown.sh'), page], {
        cwd: data.path
      }).status,
      0
    )
  } finally {
    data.cleanup()
  }
})
