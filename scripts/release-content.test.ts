import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  inspectReleaseContent,
  type PublishedContract,
  type ReleaseContent
} from './release-content.compute.ts'

const installed: PublishedContract = {
  version: '1.0.2',
  defaultPreset: 'neongate',
  presetNames: ['neongate', 'periwinkle', 'magenta', 'peach', 'mocha', 'ivory']
}

function fixture(): ReleaseContent {
  return {
    dependencyVersion: '1.0.2',
    changelog: '# Changelog\n\n## 1.0.2 — Released\n\n## 1.0.1 — History\n',
    cdn: `# CDN

Use the published \`1.0.2\` release.

## jsDelivr

<script src="https://cdn.jsdelivr.net/npm/@neongate-ai/orbz@1.0.2/dist/standalone/orbz.js"></script>

## unpkg

<script src="https://unpkg.com/@neongate-ai/orbz@1.0.2/dist/standalone/orbz.js"></script>
`,
    snapshot: `# Public contract

The published \`@neongate-ai/orbz@1.0.2\` package.

## Appearance

| Fact | Value |
|---|---|
| Default preset | \`neongate\` |
| Deprecated input alias | \`gojhonny\`, normalized to \`neongate\` |

The canonical \`ORBZ_PRESET_NAMES\` values are:

- \`neongate\`
- \`periwinkle\`
- \`magenta\`
- \`peach\`
- \`mocha\`
- \`ivory\`
`
  }
}

test('CDN introduction cannot name an old release while every URL is current', () => {
  const content = fixture()
  content.cdn = content.cdn.replace('`1.0.2` release', '`0.3.1` release')
  assert.match(
    inspectReleaseContent(content, installed).join('\n'),
    /CDN introduction/
  )
})

test('snapshot version, default and canonical list cannot retain an older package', () => {
  const content = fixture()
  content.snapshot = content.snapshot
    .replace('@neongate-ai/orbz@1.0.2', '@neongate-ai/orbz@1.0.1')
    .replace(
      '| Default preset | `neongate` |',
      '| Default preset | `gojhonny` |'
    )
    .replace('- `neongate`', '- `gojhonny`')
  const failures = inspectReleaseContent(content, installed).join('\n')
  assert.match(failures, /snapshot version/)
  assert.match(failures, /snapshot default preset/)
  assert.match(failures, /snapshot canonical presets/)
})

test('exact current content passes while historical changelog entries remain untouched', () => {
  assert.deepEqual(inspectReleaseContent(fixture(), installed), [])
})

test('the dependency must be exact and installed before auditing its public contract', () => {
  for (const dependencyVersion of ['^1.0.2', 'latest', '1.0.1', '']) {
    assert.match(
      inspectReleaseContent(
        { ...fixture(), dependencyVersion },
        installed
      ).join('\n'),
      /exact installed Orbz version/
    )
  }
  assert.match(
    inspectReleaseContent(fixture(), { ...installed, version: '1.0.1' }).join(
      '\n'
    ),
    /exact installed Orbz version/
  )
})

test('moving tags, omitted versions and a single stale CDN URL fail', () => {
  for (const replacement of ['/', '@1.0.1/', '@latest/', '@^1.0.2/']) {
    const content = fixture()
    content.cdn = content.cdn.replace('orbz@1.0.2/', `orbz${replacement}`)
    assert.notDeepEqual(
      inspectReleaseContent(content, installed),
      [],
      `invalid CDN suffix: ${replacement}`
    )
  }
})

test('current release markers cannot be missing or supplied by historical entries', () => {
  const cases: [Partial<ReleaseContent>, RegExp][] = [
    [{ changelog: '# Changelog\n\n## 1.0.1 — History\n' }, /newest changelog/],
    [{ changelog: '# Changelog\n' }, /newest changelog/],
    [{ cdn: '# CDN\n' }, /CDN introduction/],
    // biome-ignore lint/nursery/noSecrets: Synthetic public release prose is not a credential.
    [{ cdn: '# CDN\n\nPublished 1.0.2.\n' }, /CDN URLs/],
    [
      { cdn: fixture().cdn.replace('`1.0.2` release', '`1.0.2-rc.1` release') },
      /CDN introduction/
    ],
    [{ snapshot: '# Public contract\n' }, /snapshot version/],
    [
      {
        snapshot: fixture().snapshot.replace(
          '| Default preset | `neongate` |',
          ''
        )
      },
      /snapshot default preset/
    ],
    [
      {
        snapshot: fixture().snapshot.replace(
          '`ORBZ_PRESET_NAMES`',
          '`OTHER_EXPORT`'
        )
      },
      /snapshot canonical presets/
    ]
  ]
  for (const [change, expected] of cases) {
    assert.match(
      inspectReleaseContent({ ...fixture(), ...change }, installed).join('\n'),
      expected
    )
  }
})

test('deprecated alias cannot become a seventh canonical preset or hide a missing palette', () => {
  for (const replacement of ['- `ivory`\n- `gojhonny`', '- `neongate`', '']) {
    const content = fixture()
    content.snapshot = content.snapshot.replace('- `ivory`', replacement)
    assert.match(
      inspectReleaseContent(content, installed).join('\n'),
      /snapshot canonical presets/
    )
  }
})

test('surrounding prose can change without redefining package truth', () => {
  const content = fixture()
  content.cdn = content.cdn.replace(
    'Use the published `1.0.2` release.',
    'Load **1.0.2** deliberately; pinning prevents unexpected contract changes.'
  )
  content.snapshot = content.snapshot
    .replace('The published', 'This snapshot describes the supported')
    .replace('values are:', 'provides these canonical choices:')
  assert.deepEqual(inspectReleaseContent(content, installed), [])
})
