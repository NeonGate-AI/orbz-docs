// biome-ignore-all lint/nursery/noSecrets: Synthetic public HTML fixtures contain no credentials; markup triggers the entropy heuristic.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { inspectRenderedPage } from './rendered-web-quality.compute.ts'

const origin = 'https://docs.example'
const homeTitle = 'Orbz — AI Voice Web Component'

function page(title = homeTitle, canonical = `${origin}/`) {
  return `<!doctype html><html lang="en"><head>
    <title>${title}</title>
    <meta name="description" content="A visible voice component.">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="A visible voice component.">
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="A visible voice component.">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="/favicon.ico">
    <link rel="icon" href="/icon.png?version=fixture">
    <link rel="apple-touch-icon" href="/apple-icon.png">
    </head><body><main>
    <input role="combobox" type="search" aria-label="Search documentation">
    <input role="combobox" type="search" aria-label="Search documentation">
    <label for="speech">Text to speak</label>
    <input id="speech" name="speech" aria-describedby="status">
    <output id="status" aria-live="polite"></output>
    </main></body></html>`
}

test('the old homepage branding fails the rendered contract', () => {
  const result = inspectRenderedPage(page('Orbz Docs | Orbz Docs'), '/', origin)
  assert.ok(result.some((failure) => failure.includes('homepage title')))
  assert.ok(result.some((failure) => failure.includes('repeated Docs brand')))
})

test('home, its canonical alias and a leaf page have consistent metadata', () => {
  assert.deepEqual(inspectRenderedPage(page(), '/', origin), [])
  assert.deepEqual(inspectRenderedPage(page(), '/orbz', origin), [])
  assert.deepEqual(
    inspectRenderedPage(
      page('API &amp; exports | Orbz Docs', `${origin}/orbz/api`),
      '/orbz/api',
      origin
    ),
    []
  )
})

test('script payloads and comments cannot hide missing metadata', () => {
  const html = page().replace(
    '<title>',
    '<!-- <title>Fake</title> --><script>const html = "<title>Fake</title>"</script><title>'
  )
  assert.deepEqual(inspectRenderedPage(html, '/', origin), [])
  const missing = html.replace(`<title>${homeTitle}</title>`, '')
  assert.ok(
    inspectRenderedPage(missing, '/', origin).some((failure) =>
      failure.includes('one nonempty title')
    )
  )
})

test('conflicting titles, descriptions, canonical hosts and social URLs fail', () => {
  const broken = page()
    .replace(
      '<meta name="description"',
      '<meta name="description" content="Duplicate"><meta name="description"'
    )
    .replace(
      '<meta property="og:title"',
      '<meta property="og:title" content="Wrong"><meta property="og:title"'
    )
    .replace(
      `name="twitter:title" content="${homeTitle}"`,
      'name="twitter:title" content="Other title"'
    )
    .replace(
      `rel="canonical" href="${origin}/"`,
      'rel="canonical" href="https://wrong.example/"'
    )
    .replace(
      `property="og:url" content="${origin}/"`,
      `property="og:url" content="${origin}/other"`
    )
  const result = inspectRenderedPage(broken, '/', origin).join('\n')
  assert.match(result, /one nonempty description/)
  assert.match(result, /one nonempty og:title/)
  assert.match(result, /twitter:title must match/)
  assert.match(result, /canonical must resolve/)
  assert.match(result, /og:url must match/)
})

test('data URI and remote icons cannot substitute for the served brand assets', () => {
  const broken = page()
    .replaceAll('/favicon.ico', 'data:image/svg+xml,fake')
    .replaceAll('/icon.png?version=fixture', 'https://other.example/icon.png')
    .replace('<link rel="apple-touch-icon" href="/apple-icon.png">', '')
  const result = inspectRenderedPage(broken, '/', origin).join('\n')
  assert.match(result, /favicon.ico/)
  assert.match(result, /icon.png/)
  assert.match(result, /apple-icon.png/)
})

test('a placeholder alone does not satisfy explicit search naming', () => {
  const broken = page().replaceAll(
    'aria-label="Search documentation"',
    'placeholder="Search docs"'
  )
  assert.match(
    inspectRenderedPage(broken, '/', origin).join('\n'),
    /search combobox must have an explicit accessible name/
  )
})

test('missing, hidden and mismatched speech labels fail even when the field has a value', () => {
  for (const replacement of [
    '',
    '<label hidden for="speech">Text to speak</label>',
    '<label for="other">Text to speak</label>',
    '<span hidden><label for="speech">Text to speak</label></span>'
  ]) {
    const broken = page().replace(
      '<label for="speech">Text to speak</label>',
      replacement
    )
    assert.match(
      inspectRenderedPage(broken, '/', origin).join('\n'),
      /speech input needs a visible associated label/
    )
  }
})

test('speech status must be an existing associated live region', () => {
  for (const broken of [
    page().replace('aria-describedby="status"', ''),
    page().replace('id="status"', 'id="other"'),
    page().replace('aria-live="polite"', '')
  ]) {
    assert.match(
      inspectRenderedPage(broken, '/', origin).join('\n'),
      /speech input needs an associated live status/
    )
  }
})

test('the build entrypoint discovers nested authored pages and rejects missing output', () => {
  const root = mkdtempSync(join(tmpdir(), 'docs-built-quality-'))
  try {
    mkdirSync(join(root, 'content/guide'), { recursive: true })
    writeFileSync(join(root, 'content/index.mdx'), '# Home\n')
    writeFileSync(join(root, 'content/guide/index.mdx'), '# Guide\n')
    writeFileSync(join(root, 'content/guide/usage.mdx'), '# Usage\n')
    const result = spawnSync(
      process.execPath,
      [
        fileURLToPath(new URL('./check-built-web-quality.ts', import.meta.url)),
        root
      ],
      { encoding: 'utf8' }
    )
    assert.equal(result.status, 1)
    for (const route of ['/', '/guide', '/guide/usage']) {
      assert.ok(
        result.stderr.includes(`${route}: generated HTML missing`),
        result.stderr
      )
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
