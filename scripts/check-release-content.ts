import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { DEFAULT_ORBZ_PRESET, ORBZ_PRESET_NAMES } from '@neongate-ai/orbz'
import orbzPackage from '@neongate-ai/orbz/package.json' with { type: 'json' }

import { inspectReleaseContent } from './release-content.compute.ts'

const root = resolve(process.argv[2] || '.')
const read = (name: string) => readFileSync(join(root, name), 'utf8')
const manifest = JSON.parse(read('package.json'))
const failures = inspectReleaseContent(
  {
    dependencyVersion: manifest.dependencies?.['@neongate-ai/orbz'] ?? '',
    changelog: read('content/orbz/changelog.mdx'),
    cdn: read('content/orbz/getting-started/cdn.mdx'),
    snapshot: read('.agents/context/orbz-public-contract.md')
  },
  {
    version: orbzPackage.version,
    defaultPreset: DEFAULT_ORBZ_PRESET,
    presetNames: ORBZ_PRESET_NAMES
  }
)

for (const failure of failures) console.error(`content FAIL: ${failure}`)
if (failures.length) process.exit(1)
console.log(
  `content PASS: release content and contract snapshot match installed Orbz ${orbzPackage.version}`
)
