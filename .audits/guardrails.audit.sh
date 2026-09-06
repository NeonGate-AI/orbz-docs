#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}

node --input-type=module - "$ROOT" <<'NODE'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2]
const config = JSON.parse(readFileSync(join(root, '.cursor/hooks.json'), 'utf8'))
assert.equal(config.version, 1, 'Cursor hooks require version 1')
for (const [event, script] of [
  ['beforeShellExecution', 'guard-shell.sh'],
  ['afterFileEdit', 'feedback-edit.sh']
]) {
  const entries = config.hooks[event]
  assert.equal(entries?.length, 1, `Missing or duplicate ${event} entry`)
  assert.equal(entries[0].command, `sh .cursor/hooks/${script}`)
  assert.equal(entries[0].timeout, 5, 'Editor hooks must remain bounded')
  assert.ok(existsSync(join(root, '.cursor/hooks', script)))
}
assert.equal(config.hooks.beforeShellExecution[0].failClosed, true)
for (const path of [
  '.cursor/README.md', '.cursor/hooks/README.md', '.cursor/agents/README.md',
  '.cursor/agents/docs-reviewer.md', '.cursor/hooks/editor-guardrails.ts',
  'scripts/editor-guardrails.test.ts'
]) assert.ok(existsSync(join(root, path)), `Missing editor surface: ${path}`)
NODE

for hook in guard-shell feedback-edit; do
  sh -n "$ROOT/.cursor/hooks/$hook.sh"
done
printf 'guardrails PASS\n'
