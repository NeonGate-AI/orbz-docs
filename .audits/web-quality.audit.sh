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

for expected in \
  'metadataBase: new URL(siteConfig.url)' \
  'openGraph:' \
  'twitter:' \
  "'max-image-preview': 'large'"; do
  grep -F "$expected" "$LAYOUT" >/dev/null || bad "root metadata contract missing: $expected"
done
grep -Eq '<html[^>]*(lang="en"|lang=\{[^}]+\})' "$LAYOUT" || bad 'root html language missing'
grep -F 'alternates: { canonical }' "$PAGE" >/dev/null || bad 'per-page canonical generation missing'
grep -F 'openGraph:' "$PAGE" >/dev/null || bad 'page-specific Open Graph metadata missing'
grep -F 'twitter:' "$PAGE" >/dev/null || bad 'page-specific Twitter metadata missing'
grep -F "mdxPath[0] === 'orbz'" "$PAGE" >/dev/null || bad '/orbz duplicate must canonicalize to root'
grep -F 'siteConfig.searchIndexable' "$ROBOTS" >/dev/null || bad 'robots must distinguish production from preview builds'
grep -F "key: 'X-Robots-Tag'" "$ROOT/next.config.mjs" >/dev/null || bad 'preview responses need a noindex X-Robots-Tag header'
grep -F 'sitemap:' "$ROBOTS" >/dev/null || bad 'production robots must advertise sitemap'
grep -F 'NEXT_PUBLIC_SITE_URL' "$CONFIG" >/dev/null || bad 'canonical host override missing'
grep -F "socialImage: '/og/orbz-docs.png'" "$CONFIG" >/dev/null || bad 'stable social image contract missing'
[ -f "$ROOT/public/og/orbz-docs.png" ] || bad 'social preview image missing'
grep -F 'search: {' "$ROOT/next.config.mjs" >/dev/null || bad 'Nextra search configuration missing'
grep -F 'codeblocks: false' "$ROOT/next.config.mjs" >/dev/null || bad 'Pagefind should avoid noisy code-block indexing by default'
grep -F '<span className="neongate-brand__wordmark">OrbZ</span>' "$LAYOUT" >/dev/null || bad 'top-left product wordmark must be OrbZ'
grep -F 'v{siteConfig.products.orbz.version}' "$LAYOUT" >/dev/null || bad 'top-left version badge must render the package-derived OrbZ version'
grep -F "const orbzVersion = packageJson.dependencies['@neongate-ai/orbz']" "$CONFIG" >/dev/null || bad 'OrbZ version badge must derive from the exact package dependency'

# Page titles receive the brand suffix from the layout; source titles must not
# repeat it. Keep homepage aliases aligned while preserving their canonical.
node - "$ROOT/content/index.mdx" "$ROOT/content/orbz/index.mdx" <<'NODE' || fail=$((fail+1))
const fs = require('node:fs')
const titles = process.argv.slice(2).map((file) => {
  const source = fs.readFileSync(file, 'utf8')
  const title = source.match(/^title:\s*(.+)$/m)?.[1]?.trim()
  if (!title || /\borbz\s+docs\b/i.test(title)) {
    console.error('web-quality FAIL: homepage title must describe the product without repeating the OrbZ Docs suffix')
    process.exit(2)
  }
  return title
})
if (new Set(titles).size !== 1) {
  console.error('web-quality FAIL: homepage alias must share its canonical page title')
  process.exit(2)
}
NODE

# Markdown images require non-empty alt; JSX img requires alt attr.
if grep -RInE '!\[\]\(' "$ROOT/content" --include='*.md' --include='*.mdx' 2>/dev/null; then bad 'empty Markdown image alt found'; fi
node - "$ROOT/content" <<'NODE' || fail=$((fail+1))
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

# Sitemap covers indexable canonical content. /orbz is an intentional duplicate
# alias of / and therefore must not be emitted separately.
node - "$ROOT" <<'NODE' || fail=$((fail+1))
const fs=require('node:fs'), path=require('node:path')
const root=process.argv[2], content=path.join(root,'content')
const routes=[]
const aliases=new Map([['/orbz','/']])
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(md|mdx)$/.test(e.name)){let r=path.relative(content,p).replaceAll(path.sep,'/').replace(/\.(md|mdx)$/,'').replace(/(^|\/)index$/,'$1').replace(/\/$/,'');routes.push(r?'/'+r:'')}}}
walk(content)
const sitemap=fs.readFileSync(path.join(root,'app/sitemap.ts'),'utf8')
const declared=new Set([...sitemap.matchAll(/['"](\/[A-Za-z0-9_./-]*)['"]/g)].map(m=>m[1]).concat(sitemap.includes("  '',")?['']:[]))
const required=routes.filter(r=>!aliases.has(r))
const missing=required.filter(r=>!declared.has(r))
if(missing.length){console.error('web-quality FAIL: sitemap missing canonical routes: '+missing.join(', '));process.exit(2)}
for(const alias of aliases.keys()) if(declared.has(alias)){console.error('web-quality FAIL: duplicate canonical alias present in sitemap: '+alias);process.exit(2)}
NODE


# Canonical pages should not compete with duplicate titles/descriptions. The
# intentional /orbz alias is excluded because it canonicalizes to root.
node - "$ROOT/content" <<'NODE' || fail=$((fail+1))
const fs=require('node:fs'),path=require('node:path')
const root=process.argv[2]
const aliases=new Set(['orbz/index.mdx'])
const values={title:new Map(),description:new Map()}
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.mdx?$/.test(e.name)){const rel=path.relative(root,p).replaceAll(path.sep,'/');if(aliases.has(rel))continue;const text=fs.readFileSync(p,'utf8');const fm=text.match(/^---\n([\s\S]*?)\n---/);if(!fm)continue;for(const key of Object.keys(values)){const m=fm[1].match(new RegExp(`^${key}:\\s*(.+)$`,'m'));if(!m)continue;const value=m[1].trim();const list=values[key].get(value)||[];list.push(rel);values[key].set(value,list)}}}}
walk(root)
const failures=[]
for(const [key,map] of Object.entries(values)) for(const [value,files] of map) if(files.length>1) failures.push(`${key} "${value}" => ${files.join(', ')}`)
if(failures.length){console.error('web-quality FAIL: duplicate canonical metadata: '+failures.join('; '));process.exit(2)}
NODE

[ "$fail" -eq 0 ] || exit 1
printf 'web-quality PASS (source contracts only; field CWV/WCAG conformance not inferred)\n'
