#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
fail=0
bad(){ printf 'performance FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
LAYOUT="$ROOT/app/layout.tsx"
PAGE="$ROOT/app/[[...mdxPath]]/page.tsx"
CONFIG="$ROOT/next.config.mjs"
CSS="$ROOT/app/globals.css"

if head -n 5 "$LAYOUT" | grep -F "'use client'" >/dev/null; then bad 'root layout must remain a Server Component'; fi
grep -F 'export const dynamicParams = false' "$PAGE" >/dev/null || bad 'known docs routes should reject dynamic fallback generation'
grep -F 'generateStaticParamsFor' "$PAGE" >/dev/null || bad 'docs routes must be statically enumerable'
grep -F 'codeblocks: false' "$CONFIG" >/dev/null || bad 'Pagefind must exclude code blocks from the default index'
grep -F '@media (prefers-reduced-motion: reduce)' "$CSS" >/dev/null || bad 'motion must be suppressible at the CSS layer'

# Keep the docs shell free from common high-cost runtime additions unless a spec
# explicitly justifies them. Nextra/Orbz package internals are outside this source scan.
if grep -RInE '<(iframe|video)\b|https://www\.googletagmanager\.com|https://www\.google-analytics\.com' "$ROOT/app" "$ROOT/content" --include='*.tsx' --include='*.mdx' 2>/dev/null; then
  bad 'unexpected heavyweight/embed runtime found in docs source'
fi
if grep -RInE "from ['\"]next/(headers|server)['\"]|\b(cookies|headers|connection)\(\)" "$ROOT/app" --include='*.ts' --include='*.tsx' 2>/dev/null; then
  bad 'request-time Next.js API would make the static docs route dynamic'
fi

# SPEC-007 admits one interactive playground, not an arbitrary increase in
# client components. Inspect TypeScript directives so comments and imports
# cannot accidentally hide or invent a client boundary.
node - "$ROOT" <<'NODE' || fail=$((fail+1))
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = process.argv[2]
const allowed = new Set([
  'app/register-element.client.tsx',
  'app/theme-toggle.client.tsx',
  'app/home-playground.client.tsx'
])
const unexpected = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, false)
      for (const statement of source.statements) {
        if (!ts.isExpressionStatement(statement) || !ts.isStringLiteral(statement.expression)) break
        if (statement.expression.text === 'use client') {
          const relative = path.relative(root, file).split(path.sep).join('/')
          if (!allowed.has(relative)) unexpected.push(relative)
        }
      }
    }
  }
}
walk(path.join(root, 'app'))
if (unexpected.length) {
  console.error('performance FAIL: client entry point needs an approved spec: ' + unexpected.join(', '))
  process.exit(2)
}
NODE

[ "$fail" -eq 0 ] || exit 1
printf 'performance PASS (source architecture only; field LCP/INP/CLS require production RUM/CrUX evidence)\n'
