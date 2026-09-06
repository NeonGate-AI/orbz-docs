import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

type Payload = Record<string, unknown>
type Permission = 'allow' | 'ask' | 'deny'

const root = realpathSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../..')
)

function insideRoot(target: string): boolean {
  const location = relative(root, target)
  return (
    location !== '..' &&
    !location.startsWith(`..${sep}`) &&
    !isAbsolute(location)
  )
}

function validScope(payload: Payload): boolean {
  if (payload.workspace_roots !== undefined) {
    if (
      !Array.isArray(payload.workspace_roots) ||
      !payload.workspace_roots.every((value) => typeof value === 'string') ||
      !payload.workspace_roots.some(
        (value) => existsSync(value) && realpathSync(value) === root
      )
    ) {
      return false
    }
  }
  if (payload.cwd !== undefined) {
    if (typeof payload.cwd !== 'string' || !isAbsolute(payload.cwd))
      return false
    return existsSync(payload.cwd) && insideRoot(realpathSync(payload.cwd))
  }
  return insideRoot(realpathSync(process.cwd()))
}

function respond(permission: Permission, message?: string): void {
  process.stdout.write(
    `${JSON.stringify({
      permission,
      ...(message && { user_message: message, agent_message: message })
    })}\n`
  )
}

function beforeShell(payload: Payload): void {
  if (!validScope(payload)) {
    respond(
      'ask',
      'Docs cannot confirm the repository scope. Review the command.'
    )
    return
  }
  if (typeof payload.command !== 'string' || !payload.command.trim()) {
    respond('ask', 'Docs received no shell command. Review the operation.')
    return
  }

  const command = payload.command
  // Conservative lexical checks, not a shell parser or a sandbox. Never execute
  // or echo the submitted command, which may itself contain sensitive values.
  const denies: [RegExp, string][] = [
    [
      /\brm\s+(?=[^\n;&|]*(?:-[a-z]*r|--recursive))(?=[^\n;&|]*(?:-[a-z]*f|--force))[^\n;&|]*\s["']?(?:\/|~\/?|\$HOME\/?|\$\{HOME\}\/?)['"]?(?:\s|$|[;&|])/i,
      'Recursive removal of a root or home directory is blocked.'
    ],
    [
      /\bgit\s+(?:commit|push)\b[^\n;&|]*--no-verify\b/i,
      'Repository validation hooks must not be bypassed.'
    ],
    [
      /\b(?:cat|head|tail|less|more|bat)\b[^\n;&|]*(?:^|[\s/'"])(?:\.env(?:\.(?!example\b|sample\b|template\b)[\w.-]+)?|\.npmrc|id_rsa|id_ed25519)["']?(?:\s|$|[;&|])/im,
      'Displaying a credential file is blocked. Inspect a redacted example.'
    ],
    [
      /(?:^|[;&|]\s*)\s*(?:printenv(?:\s+[\w]*(?:TOKEN|SECRET|PASSWORD|KEY)[\w]*)?|env)\s*(?:$|[;&|])/i,
      'Dumping environment credentials is blocked. Check presence without values.'
    ],
    [
      /\b(?:echo|printf)\b[^\n;&|]*\$\{?\w*(?:TOKEN|SECRET|PASSWORD|API_KEY)\w*/i,
      'Printing credential variables is blocked. Check presence without values.'
    ]
  ]

  for (const [pattern, message] of denies) {
    if (pattern.test(command)) {
      respond('deny', message)
      return
    }
  }

  if (
    /\bgit\s+(?:push\b[^\n;&|]*(?:--force(?:-with-lease)?\b|\s-f\b)|reset\s+--hard\b|clean\b[^\n;&|]*(?:\s-[a-z]*f|--force))|\b(?:npm|pnpm)\s+(?:publish|unpublish|deprecate)\b/i.test(
      command
    )
  ) {
    respond(
      'ask',
      'Confirm authorization for this destructive history or registry operation.'
    )
    return
  }
  // Ordinary edits, pushes and merges keep the session's existing authorization.
  respond('allow')
}

function afterEdit(payload: Payload): void {
  if (!validScope(payload) || typeof payload.file_path !== 'string') return
  const target = resolve(root, payload.file_path)
  if (!existsSync(target)) return
  const canonical = realpathSync(target)
  if (!insideRoot(canonical) || !statSync(canonical).isFile()) return
  const location = relative(root, canonical)
  if (
    !/\.(?:[jt]sx?|jsonc?)$/i.test(location) ||
    /(?:^|[/\\])(?:node_modules|\.git|\.next|dist|_pagefind)(?:[/\\]|$)/.test(
      location
    )
  ) {
    return
  }

  const biome = join(root, 'node_modules', '.bin', 'biome')
  if (!existsSync(biome)) return
  const result = spawnSync(biome, ['check', '--', canonical], {
    cwd: root,
    encoding: 'utf8',
    timeout: 3000,
    maxBuffer: 64 * 1024,
    env: { ...process.env, CI: 'true', NO_COLOR: '1' }
  })
  if (result.error || result.status !== 0) {
    // Avoid copying arbitrary tool output or edited source into hook logs.
    process.stderr.write(
      'Docs edit feedback: local Biome check needs attention; run pnpm lint and pnpm format:check.\n'
    )
  }
}

// biome-ignore lint/nursery/noSecrets: Public Cursor hook event identifier.
const shellEvent = 'beforeShellExecution'
// biome-ignore lint/nursery/noSecrets: Public Cursor hook event identifier.
const editEvent = 'afterFileEdit'
const event = process.argv[2]
try {
  const raw = readFileSync(0, 'utf8')
  const payload: unknown = JSON.parse(raw)
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid hook payload')
  }
  if (event === shellEvent) beforeShell(payload as Payload)
  else if (event === editEvent) afterEdit(payload as Payload)
} catch {
  if (event === shellEvent) {
    respond('ask', 'Docs could not read the hook payload. Review the command.')
  }
} finally {
  if (event !== shellEvent) process.stdout.write('{}\n')
}
