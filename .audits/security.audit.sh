#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
fail=0
bad(){ printf 'security FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
CONFIG="$ROOT/next.config.mjs"
CI="$ROOT/.github/workflows/ci.yml"
VERCEL="$ROOT/vercel.json"

for expected in \
  "default-src 'self'" \
  "script-src-attr 'none'" \
  "worker-src 'self' blob:" \
  "object-src 'none'" \
  "base-uri 'self'" \
  "form-action 'self'" \
  "frame-ancestors 'none'" \
  "Content-Security-Policy" \
  "Cross-Origin-Opener-Policy" \
  "Cross-Origin-Resource-Policy" \
  "Permissions-Policy" \
  "Referrer-Policy" \
  "Strict-Transport-Security" \
  "X-Content-Type-Options" \
  "poweredByHeader: false"; do
  grep -F "$expected" "$CONFIG" >/dev/null || bad "missing security contract: $expected"
done

grep -F "'wasm-unsafe-eval'" "$CONFIG" >/dev/null || bad 'Pagefind CSP requires wasm-unsafe-eval'
grep -F "...(isDevelopment ? [\"'unsafe-eval'\"] : [])" "$CONFIG" >/dev/null || bad 'unsafe-eval must be development-only'

# Exercise the exported response-header contract in both deploy modes. Checking
# source strings alone cannot detect a later header override or widened origin.
for deploy_mode in production preview; do
  NODE_ENV=production VERCEL_ENV="$deploy_mode" node --input-type=module - "$CONFIG" <<'JS_HEADERS' || fail=$((fail+1))
import { pathToFileURL } from 'node:url'
const { default: config } = await import(pathToFileURL(process.argv[2]).href)
const groups = await config.headers()
const baseline = groups.find(({ source }) => source === '/(.*)')
const headers = new Map((baseline?.headers ?? []).map(({ key, value }) => [key.toLowerCase(), value]))
const directives = new Map((headers.get('content-security-policy') ?? '').split(';').filter(Boolean).map((part) => {
  const [name, ...sources] = part.trim().split(/\s+/)
  return [name, sources]
}))
const failures = []
if (groups.length !== 1 || !baseline) failures.push('unreviewed header route group')
for (const [name, expected] of Object.entries({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"],
  'script-src-attr': ["'none'"],
  'connect-src': ["'self'"],
  'frame-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'object-src': ["'none'"]
})) {
  if (JSON.stringify(directives.get(name)) !== JSON.stringify(expected)) failures.push(name)
}
for (const permission of ['microphone=()', 'camera=()', 'geolocation=()']) {
  if (!(headers.get('permissions-policy') ?? '').split(/,\s*/).includes(permission)) failures.push(permission)
}
if (!directives.has('upgrade-insecure-requests')) failures.push('upgrade-insecure-requests')
if (process.env.VERCEL_ENV === 'preview') {
  if (headers.get('x-robots-tag') !== 'noindex, nofollow, noarchive') failures.push('preview noindex')
} else if (headers.has('x-robots-tag')) failures.push('production indexing header')
if (failures.length) {
  console.error(`security FAIL: ${process.env.VERCEL_ENV} exported header contract: ${failures.join(', ')}`)
  process.exit(2)
}
JS_HEADERS
done

grep -F 'pnpm install --frozen-lockfile' "$CI" >/dev/null || bad 'CI must use the frozen lockfile'
grep -F 'pnpm install --frozen-lockfile' "$VERCEL" >/dev/null || bad 'Vercel must use the frozen lockfile'
if grep -RIn -- '--no-frozen-lockfile' "$CI" "$VERCEL" >/dev/null 2>&1; then bad 'non-frozen installs are forbidden in CI/deploy'; fi
grep -F 'persist-credentials: false' "$CI" >/dev/null || bad 'checkout credentials must not persist after checkout'
[ -f "$ROOT/.github/dependabot.yml" ] || bad 'Dependabot configuration missing'

# Supply-chain actions must be pinned to immutable commit SHAs.
node - "$CI" <<'JS_ACTIONS' || fail=$((fail+1))
const fs=require('node:fs')
const file=process.argv[2]
const uses=[...fs.readFileSync(file,'utf8').matchAll(/^\s*uses:\s*(\S+)/gm)].map(m=>m[1])
const failures=uses.filter(value=>!/@[0-9a-f]{40}$/i.test(value))
if(failures.length){console.error('security FAIL: GitHub Action not pinned to immutable SHA: '+failures.join(', '));process.exit(2)}
JS_ACTIONS

# Runtime and tooling dependencies are exact, and patched framework floors are enforced.
node - "$ROOT/package.json" <<'JS_MANIFEST' || fail=$((fail+1))
const pkg=require(process.argv[2])
const failures=[]
for(const section of ['dependencies','devDependencies']){
  for(const [name,version] of Object.entries(pkg[section]||{})){
    if(!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) failures.push(`${section}.${name}=${version}`)
  }
}
if(failures.length){console.error('security FAIL: dependency versions must be exact: '+failures.join(', '));process.exit(2)}

const parse=(value)=>value.split('.').map(part=>Number.parseInt(part,10))
const atLeast=(value,minimum)=>{
  const a=parse(value), b=parse(minimum)
  for(let i=0;i<3;i++){if(a[i]!==b[i]) return a[i]>b[i]}
  return true
}
if(!atLeast(pkg.dependencies.next,'16.3.3')){
  console.error(`security FAIL: Next.js ${pkg.dependencies.next} predates the 16.3.3 critical security release`)
  process.exit(2)
}
if(!atLeast(pkg.dependencies.react,'19.2.8') || !atLeast(pkg.dependencies['react-dom'],'19.2.8')){
  console.error('security FAIL: React/React DOM must remain at or above the 19.2.8 patched release')
  process.exit(2)
}
JS_MANIFEST

# Lockfile must resolve the exact framework version declared by the manifest.
node - "$ROOT/package.json" "$ROOT/pnpm-lock.yaml" <<'JS_LOCK' || fail=$((fail+1))
const fs=require('node:fs')
const pkg=require(process.argv[2])
const lock=fs.readFileSync(process.argv[3],'utf8')
const next=pkg.dependencies.next
for(const expected of [`specifier: ${next}`, `next@${next}:`, `'@next/env@${next}':`]){
  if(!lock.includes(expected)){
    console.error(`security FAIL: pnpm lockfile does not resolve manifest Next.js ${next}: missing ${expected}`)
    process.exit(2)
  }
}
if(lock.includes('16.3.1')){
  console.error('security FAIL: vulnerable Next.js 16.3.1 remains in the lockfile')
  process.exit(2)
}
JS_LOCK

# Search executable application code, not prose examples, for high-risk primitives.
if grep -RInE 'dangerouslySetInnerHTML|\beval\s*\(|\bnew Function\s*\(|javascript:' "$ROOT/app" --include='*.ts' --include='*.tsx' --include='*.js' --include='*.mjs' 2>/dev/null; then
  bad 'high-risk executable primitive found in app source'
fi

# Cheap repository-wide credential tripwire. This is intentionally narrow to avoid
# turning placeholder documentation into false positives; CI secret scanning remains
# complementary, not replaced by this check.
if grep -RInE \
  --exclude-dir=.git \
  --exclude-dir=.next \
  --exclude-dir=node_modules \
  --exclude='pnpm-lock.yaml' \
  -- '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|sk_live_[A-Za-z0-9]{16,}|sk-proj-[A-Za-z0-9_-]{16,}' \
  "$ROOT" >/dev/null 2>&1; then
  bad 'credential-like material found in repository source'
fi

grep -F 'must use HTTPS outside localhost' "$ROOT/site.config.ts" >/dev/null || bad 'canonical host must enforce HTTPS outside localhost'

[ "$fail" -eq 0 ] || exit 1
printf 'security PASS (source/supply-chain contracts; dependency advisory audit runs separately in CI)\n'
