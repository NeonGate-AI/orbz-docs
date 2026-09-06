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

node - "$LAYOUT" <<'NODE' || fail=$((fail+1))
const fs = require('node:fs')
const source = fs.readFileSync(process.argv[2], 'utf8')
const orbs = [...source.matchAll(/<orb-z\b[\s\S]*?\/>/g)]
if (orbs.length !== 2 || orbs.some(([tag]) =>
  !tag.includes('aria-hidden="true"') ||
  !tag.includes('tabIndex={-1}') ||
  !tag.includes('reduced-motion="always"')
)) {
  console.error('accessibility FAIL: both decorative shell orbs must be static and outside the accessibility/focus tree')
  process.exit(2)
}
if (!/search=\{<Search\b[^>]*\/>\}/.test(source) || [...source.matchAll(/<Search\b/g)].length !== 1) {
  console.error('accessibility FAIL: provide one Search through Layout; Nextra owns desktop and mobile placement')
  process.exit(2)
}
NODE
grep -F 'aria-label={`Switch to ${nextTheme} theme`}' "$TOGGLE" >/dev/null || bad 'theme toggle must announce its target theme'
grep -F 'type="button"' "$TOGGLE" >/dev/null || bad 'theme toggle must be a non-submit button'
grep -F ':focus-visible' "$CSS" >/dev/null || bad 'visible keyboard focus treatment missing'
grep -F '@media (prefers-reduced-motion: reduce)' "$CSS" >/dev/null || bad 'reduced-motion stylesheet missing'
grep -F '@media (forced-colors: active)' "$CSS" >/dev/null || bad 'forced-colors support missing'
grep -F -- '-webkit-text-fill-color: CanvasText' "$CSS" >/dev/null || bad 'transparent gradient text must remain readable in forced-colors mode'
grep -F 'min-block-size: 2rem' "$CSS" >/dev/null || bad 'custom navbar target must meet the 24px WCAG 2.5.8 floor'

# Read authored CSS rather than a duplicate palette. Solid page/surface colors
# provide deterministic source evidence; browser review covers composited paint.
node - "$CSS" "$ROOT/app/home-playground.css" <<'NODE' || fail=$((fail+1))
const fs = require('node:fs')
const hasPlayground = fs.existsSync(process.argv[3])
const css = process.argv.slice(2).filter((file) => fs.existsSync(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^{}]*)\\}`))
  if (!match) throw new Error(`Missing CSS rule: ${selector}`)
  return Object.fromEntries([...match[1].matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]))
}
const light = block(':root')
const dark = { ...light, ...block('html.dark') }
function color(value, tokens, visited = new Set()) {
  if (/^#[0-9a-f]{6}$/i.test(value || '')) return value
  const token = value?.match(/^var\((--[\w-]+)\)$/)?.[1]
  if (!token || visited.has(token)) throw new Error(`Unresolved audited CSS color: ${value}`)
  visited.add(token)
  return color(tokens[token], tokens, visited)
}
function rgb(hex){const v=hex.replace('#','');return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255)}
function lum(hex){return rgb(hex).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0)}
function ratio(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
const focus = block(':focus-visible').outline?.match(/(var\(--[\w-]+\)|#[0-9a-f]{6})$/i)?.[1]
const gradient = block('.orbz-gradient-text')['background-image']
const stops = [...(gradient || '').matchAll(/var\((--[\w-]+)\)|#[0-9a-f]{6}/gi)].map(([value]) => value)
if (!stops.length) throw new Error('Heading gradient must expose auditable color stops')
const primary = block('.orbz-button--primary')
const failures = []
for (const [theme, tokens] of [['light', light], ['dark', dark]]) {
  const pairs = []
  for (const surface of ['--orbz-page', '--orbz-surface-strong']) {
    for (const text of ['--orbz-text', '--orbz-muted', '--orbz-link']) {
      pairs.push([`${theme} ${text}/${surface}`, tokens[text], tokens[surface], 4.5])
    }
    pairs.push([`${theme} focus/${surface}`, focus, tokens[surface], 3])
    for (const [index, stop] of stops.entries()) {
      pairs.push([`${theme} heading stop ${index + 1}/${surface}`, stop, tokens[surface], 3])
    }
  }
  pairs.push([`${theme} primary button`, primary.color, primary.background, 4.5])
  if (hasPlayground) {
    const codeString = block(theme === 'dark' ? 'html.dark .orbz-code-string' : '.orbz-code-string').color
    pairs.push([`${theme} code strings`, codeString, tokens['--orbz-surface-strong'], 4.5])
    for (const selector of ['.orbz-color-control input', '.orbz-speech-input-row input']) {
      const boundary = block(selector).border?.match(/(var\(--[\w-]+\)|#[0-9a-f]{6})$/i)?.[1]
      pairs.push([`${theme} ${selector} boundary`, boundary, tokens['--orbz-page'], 3])
      pairs.push([`${theme} ${selector} inner boundary`, boundary, tokens['--orbz-surface-strong'], 3])
    }
  }
  for (const [name, fg, bg, minimum] of pairs) {
    const contrast = ratio(color(fg, tokens), color(bg, tokens))
    if (contrast < minimum) failures.push(`${name}: ${contrast.toFixed(2)}:1 < ${minimum}:1`)
  }
}
if (failures.length) {
  console.error('accessibility FAIL: authored CSS contrast: '+failures.join(', '))
  process.exit(2)
}
NODE

[ "$fail" -eq 0 ] || exit 1
printf 'accessibility PASS (source/contrast contracts; manual AT and keyboard verification still required)\n'
