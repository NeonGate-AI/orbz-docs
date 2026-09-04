#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
fail=0
bad() { printf 'architecture FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }

for path in app content .agents .audits package.json next.config.mjs site.config.ts; do
  [ -e "$ROOT/$path" ] || bad "missing required repository surface: $path"
done
[ -f "$ROOT/app/[[...mdxPath]]/page.tsx" ] || bad 'missing Nextra content catch-all route'
grep -F "from 'nextra/pages'" "$ROOT/app/[[...mdxPath]]/page.tsx" >/dev/null || bad 'catch-all route must use nextra/pages'
grep -F "from 'nextra/page-map'" "$ROOT/app/layout.tsx" >/dev/null || bad 'root layout must load Nextra page map'
grep -F '"@neongate-ai/orbz"' "$ROOT/package.json" >/dev/null || bad 'docs must consume published Orbz package'
if grep -RInE 'Memory Nucleus|Chatterbox|@nucleus/|workspaces/ai/|cli/elo|Elo audit|Amarelo' "$ROOT/.agents" "$ROOT/AGENTS.md" "$ROOT/.github" 2>/dev/null; then
  bad 'legacy cross-project harness assumptions remain'
fi
if grep -RIn 'workspace:\*' "$ROOT/package.json" "$ROOT/pnpm-workspace.yaml" 2>/dev/null; then
  bad 'product workspace coupling is forbidden'
fi

# Every harness directory must explain itself.
for base in "$ROOT/.agents" "$ROOT/.audits"; do
  find "$base" -type d -print | while IFS= read -r d; do
    [ -f "$d/README.md" ] || [ -f "$d/readme.md" ] || { printf 'architecture FAIL: missing README in %s\n' "${d#$ROOT/}" >&2; exit 7; }
  done || fail=$((fail+1))
done

[ "$fail" -eq 0 ] || exit 1
printf 'architecture PASS\n'
