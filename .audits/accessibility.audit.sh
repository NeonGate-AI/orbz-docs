#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
fail=0
bad(){ printf 'accessibility FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
LAYOUT="$ROOT/app/layout.tsx"
TOGGLE="$ROOT/app/theme-toggle.client.tsx"
CSS="$ROOT/app/globals.css"

# Nextra owns the page-level <main>. Authored MDX must not introduce a second
# landmark outside code examples.
node - "$ROOT/content" <<'NODE' || fail=$((fail+1))
const fs = require('node:fs')
const path = require('node:path')
const root = process.argv[2]
const failures = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.mdx?$/.test(entry.name)) {
      const lines = fs.readFileSync(file, 'utf8').split('\n')
      let fenced = false
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]
        if (/^\s*```/.test(line)) { fenced = !fenced; continue }
        if (!fenced && /<\/?main\b/.test(line)) {
          failures.push(`${path.relative(root, file)}:${index + 1}`)
        }
      }
    }
  }
}
walk(root)
if (failures.length) {
  console.error('accessibility FAIL: authored MDX adds a second main landmark: ' + failures.join(', '))
  process.exit(2)
}
NODE

# Every real/code-sample button should state its type. Inline prose such as
# `<button>` is ignored so documentation terminology does not trigger the gate.
node - "$ROOT/app" "$ROOT/content" <<'NODE' || fail=$((fail+1))
const fs = require('node:fs')
const path = require('node:path')
const roots = process.argv.slice(2)
const failures = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.(tsx|jsx|mdx?)$/.test(entry.name)) {
      const lines = fs.readFileSync(file, 'utf8').split('\n')
      let fenced = false
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]
        if (/^\s*```/.test(line)) { fenced = !fenced; continue }
        for (const match of line.matchAll(/<button\b[^>]*>/g)) {
          if (!fenced) {
            const before = line.slice(0, match.index)
            const backticks = (before.match(/`/g) || []).length
            if (backticks % 2 === 1) continue
          }
          if (!/\btype\s*=/.test(match[0])) {
            failures.push(`${file}:${index + 1}`)
          }
        }
      }
    }
  }
}
for (const root of roots) walk(root)
if (failures.length) {
  console.error('accessibility FAIL: button missing explicit type: ' + failures.join(', '))
  process.exit(2)
}
NODE

grep -F 'aria-hidden="true"' "$LAYOUT" >/dev/null || bad 'decorative OrbZ shell orbs must be hidden from assistive technology'
grep -F 'reduced-motion="system"' "$LAYOUT" >/dev/null || bad 'decorative OrbZ shell orbs must follow reduced-motion preferences'
grep -F 'aria-label={`Switch to ${nextTheme} theme`}' "$TOGGLE" >/dev/null || bad 'theme toggle must announce its target theme'
grep -F 'type="button"' "$TOGGLE" >/dev/null || bad 'theme toggle must be a non-submit button'
grep -F ':focus-visible' "$CSS" >/dev/null || bad 'visible keyboard focus treatment missing'
grep -F '@media (prefers-reduced-motion: reduce)' "$CSS" >/dev/null || bad 'reduced-motion stylesheet missing'
grep -F '@media (forced-colors: active)' "$CSS" >/dev/null || bad 'forced-colors support missing'
grep -F -- '-webkit-text-fill-color: CanvasText' "$CSS" >/dev/null || bad 'transparent gradient text must remain readable in forced-colors mode'
grep -F 'min-block-size: 2rem' "$CSS" >/dev/null || bad 'custom navbar target must meet the 24px WCAG 2.5.8 floor'

# Contrast checks for the stable chrome/content token pairs. Ratios are computed,
# not asserted by inspection. Threshold is WCAG AA normal text (4.5:1).
node <<'NODE' || fail=$((fail+1))
function rgb(hex){const v=hex.replace('#','');return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255)}
function lum(hex){return rgb(hex).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0)}
function ratio(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
const pairs=[
  ['light text','#14142b','#f6f7ff'],
  ['light muted','#515875','#f6f7ff'],
  ['light link','#3927cc','#f6f7ff'],
  ['dark text','#f6f7ff','#070810'],
  ['dark muted','#aeb3c8','#070810'],
  ['dark link','#8d82ff','#070810'],
  ['primary button','#ffffff','#5948eb']
]
const failures=[]
for(const [name,fg,bg] of pairs){const r=ratio(fg,bg);if(r<4.5) failures.push(`${name} ${r.toFixed(2)}:1`)}
if(failures.length){console.error('accessibility FAIL: contrast below 4.5:1: '+failures.join(', '));process.exit(2)}
NODE

[ "$fail" -eq 0 ] || exit 1
printf 'accessibility PASS (source/contrast contracts; manual AT and keyboard verification still required)\n'
