#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
fail=0
bad(){ printf 'web-quality FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
LAYOUT="$ROOT/app/layout.tsx"
PAGE="$ROOT/app/[[...mdxPath]]/page.tsx"
ROBOTS="$ROOT/app/robots.ts"
SITEMAP="$ROOT/app/sitemap.ts"
CONFIG="$ROOT/site.config.ts"

grep -F 'metadataBase: new URL(siteConfig.url)' "$LAYOUT" >/dev/null || bad 'root metadataBase must use siteConfig.url'
grep -F 'openGraph:' "$LAYOUT" >/dev/null || bad 'root Open Graph metadata missing'
grep -F 'twitter:' "$LAYOUT" >/dev/null || bad 'root Twitter metadata missing'
grep -Eq '<html[^>]*(lang="en"|lang=\{[^}]+\})' "$LAYOUT" || bad 'root html language missing'
grep -F 'alternates: { canonical }' "$PAGE" >/dev/null || bad 'per-page canonical generation missing'
grep -F 'sitemap:' "$ROBOTS" >/dev/null || bad 'robots must advertise sitemap'
grep -F 'NEXT_PUBLIC_SITE_URL' "$CONFIG" >/dev/null || bad 'canonical host override missing'
grep -F "search: {" "$ROOT/next.config.mjs" >/dev/null || bad 'Nextra search configuration missing'
grep -F 'codeblocks: false' "$ROOT/next.config.mjs" >/dev/null || bad 'Pagefind should avoid noisy code-block indexing by default'

# MDX raw image check (Markdown images require non-empty alt; JSX img requires alt attr).
if grep -RInE '!\[\]\(' "$ROOT/content" --include='*.md' --include='*.mdx' 2>/dev/null; then bad 'empty Markdown image alt found'; fi
node - "$ROOT/content" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const root = process.argv[2]
const failures = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.mdx$/.test(entry.name)) {
      const source = fs.readFileSync(file, 'utf8')
      for (const match of source.matchAll(/<img\b[\s\S]*?>/gi)) {
        if (!/\balt\s*=/.test(match[0])) {
          const line = source.slice(0, match.index).split('\n').length
          failures.push(`${path.relative(root, file)}:${line}`)
        }
      }
    }
  }
}
walk(root)
if (failures.length) {
  console.error('web-quality FAIL: JSX <img> without alt attribute: ' + failures.join(', '))
  process.exit(2)
}
NODE

# Ensure sitemap routes cover every content page using source-level comparison.
node - "$ROOT" <<'NODE'
const fs=require('node:fs'), path=require('node:path')
const root=process.argv[2], content=path.join(root,'content')
const routes=[]
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(md|mdx)$/.test(e.name)){let r=path.relative(content,p).replaceAll(path.sep,'/').replace(/\.(md|mdx)$/,'').replace(/(^|\/)index$/,'$1').replace(/\/$/,'');routes.push(r?'/'+r:'')}}}
walk(content)
const sitemap=fs.readFileSync(path.join(root,'app/sitemap.ts'),'utf8')
const declared=new Set([...sitemap.matchAll(/['"](\/[A-Za-z0-9_./-]*)['"]/g)].map(m=>m[1]).concat(sitemap.includes("  '',")?['']:[]))
const missing=routes.filter(r=>!declared.has(r))
if(missing.length){console.error('web-quality FAIL: sitemap missing routes: '+missing.join(', '));process.exit(2)}
NODE
status=$?; [ "$status" -eq 0 ] || fail=$((fail+1))

[ "$fail" -eq 0 ] || exit 1
printf 'web-quality PASS (source contracts only; field CWV/WCAG conformance not inferred)\n'
