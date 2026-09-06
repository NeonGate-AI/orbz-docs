import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
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

function hook(
  event: 'guard-shell' | 'feedback-edit',
  payload: unknown,
  cwd = root,
  raw = false
) {
  const result = spawnSync('sh', [join(cwd, `.cursor/hooks/${event}.sh`)], {
    cwd,
    input: raw ? String(payload) : JSON.stringify(payload),
    encoding: 'utf8',
    timeout: 6000
  })
  assert.equal(result.status, 0, result.stderr)
  return { output: JSON.parse(result.stdout), stderr: result.stderr }
}

test('shell hook allows normal work without executing the proposed command', () => {
  for (const command of [
    'git status --short',
    'rg --files content',
    'pnpm check',
    'git push origin feature/docs',
    'git merge feature/docs',
    'gh pr merge 1 --merge',
    'cat .env.example',
    'printenv NODE_ENV',
    'env CI=true pnpm lint'
  ]) {
    assert.equal(hook('guard-shell', { command }).output.permission, 'allow')
  }
  const proposed = join(root, 'hook-must-not-execute.fixture')
  assert.equal(existsSync(proposed), false)
  assert.equal(
    hook('guard-shell', { command: `touch ${proposed}` }).output.permission,
    'allow'
  )
  assert.equal(existsSync(proposed), false)
})

test('shell hook denies obvious deletion and credential exposure with protocol messages', () => {
  for (const command of [
    'rm -rf /',
    'rm -fr "$HOME"',
    'rm --recursive --force ~/',
    'git commit --no-verify -m fix',
    'git push origin main --no-verify',
    'cat .env',
    'cat ".env.local"',
    'head /tmp/.npmrc',
    'cat ~/.ssh/id_ed25519',
    'printenv',
    'printenv NPM_TOKEN',
    'echo "$NPM_TOKEN"',
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Literal shell input, never evaluated by this test.
    'printf "%s" "${OPENAI_API_KEY}"',
    'env'
  ]) {
    const { output } = hook('guard-shell', { command })
    assert.equal(output.permission, 'deny', command)
    assert.equal(typeof output.user_message, 'string')
    assert.equal(output.agent_message, output.user_message)
    assert.equal('userMessage' in output, false)
  }
})

test('shell hook asks about malformed data, repository scope and destructive boundaries', () => {
  for (const payload of [null, [], {}, { command: 42 }, { command: ' ' }]) {
    assert.equal(hook('guard-shell', payload).output.permission, 'ask')
  }
  assert.equal(
    hook('guard-shell', '{oops', root, true).output.permission,
    'ask'
  )
  for (const command of [
    'git push --force-with-lease origin main',
    'git push -f origin main',
    'git reset --hard HEAD',
    'git clean -fd',
    'npm publish --access public'
  ]) {
    assert.equal(hook('guard-shell', { command }).output.permission, 'ask')
  }
  for (const scope of [
    { cwd: tmpdir() },
    { cwd: '../' },
    { workspace_roots: [tmpdir()] },
    { workspace_roots: 'invalid' }
  ]) {
    assert.equal(
      hook('guard-shell', { command: 'git status', ...scope }).output
        .permission,
      'ask'
    )
  }
  assert.equal(
    hook('guard-shell', {
      command: 'git status',
      cwd: join(root, 'content'),
      workspace_roots: [tmpdir(), root]
    }).output.permission,
    'allow'
  )
})

test('edit hook runs only a bounded local read-only Biome check', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'docs-editor-'))
  try {
    cpSync(join(root, '.cursor'), join(fixture, '.cursor'), { recursive: true })
    writeFileSync(join(fixture, 'package.json'), '{"type":"module"}')
    mkdirSync(join(fixture, 'node_modules/.bin'), { recursive: true })
    writeFileSync(
      join(fixture, 'node_modules/.bin/biome'),
      '#!/bin/sh\nprintf "%s\\n" "$@" > biome-arguments.fixture\nexit 1\n',
      { mode: 0o755 }
    )
    const target = join(fixture, 'example.ts')
    const source = 'export const sample = 1;\n'
    writeFileSync(target, source)
    const { output, stderr } = hook(
      'feedback-edit',
      { file_path: target, workspace_roots: [fixture] },
      fixture
    )
    assert.deepEqual(output, {})
    assert.match(stderr, /local Biome check needs attention/)
    assert.deepEqual(
      readFileSync(join(fixture, 'biome-arguments.fixture'), 'utf8')
        .trim()
        .split('\n'),
      ['check', '--', target]
    )
    assert.equal(readFileSync(target, 'utf8'), source)
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})

test('edit hook skips outside paths, symlinks, unsupported/generated files and missing tools', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'docs-editor-'))
  const external = mkdtempSync(join(tmpdir(), 'docs-editor-external-'))
  try {
    cpSync(join(root, '.cursor'), join(fixture, '.cursor'), { recursive: true })
    writeFileSync(join(fixture, 'package.json'), '{"type":"module"}')
    mkdirSync(join(fixture, 'node_modules/.bin'), { recursive: true })
    writeFileSync(
      join(fixture, 'node_modules/.bin/biome'),
      '#!/bin/sh\ntouch biome-must-not-run.fixture\n',
      { mode: 0o755 }
    )
    const outside = join(external, 'outside.ts')
    writeFileSync(outside, 'export const outside = 1\n')
    symlinkSync(outside, join(fixture, 'symlink.ts'))
    mkdirSync(join(fixture, '.next'))
    writeFileSync(join(fixture, '.next/generated.ts'), 'export {}\n')
    writeFileSync(join(fixture, 'README.md'), '# Example\n')
    for (const file_path of [
      outside,
      '../outside.ts',
      'symlink.ts',
      '.next/generated.ts',
      'README.md',
      'missing.ts',
      '.'
    ]) {
      assert.deepEqual(hook('feedback-edit', { file_path }, fixture).output, {})
    }
    assert.deepEqual(hook('feedback-edit', '{oops', fixture, true).output, {})
    assert.equal(existsSync(join(fixture, 'biome-must-not-run.fixture')), false)
    rmSync(join(fixture, 'node_modules'), { recursive: true, force: true })
    assert.deepEqual(
      hook('feedback-edit', { file_path: 'package.json' }, fixture).output,
      {}
    )
  } finally {
    rmSync(fixture, { recursive: true, force: true })
    rmSync(external, { recursive: true, force: true })
  }
})
