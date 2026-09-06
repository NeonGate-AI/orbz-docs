import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { lstatSync, readFileSync, realpathSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const root = realpathSync(resolve(process.argv[2] || '.'))
// Fingerprints avoid republishing unrelated private identifiers in this repository.
// They are regression tripwires, not encryption, a privacy proof or a secret scanner.
const protectedHashes = new Set([
  // biome-ignore lint/nursery/noSecrets: Public SHA-256 terminology fingerprint; not a credential.
  'b2c30a22b8ed6884c795c238921208d2b2157b3ed468516ee168e8913edfb0f6',
  // biome-ignore lint/nursery/noSecrets: Public SHA-256 terminology fingerprint; not a credential.
  'a1a5c0847a310bb097abc6950e6f34f7a936fd4a057c3c4f07182c4750534cf2',
  // biome-ignore lint/nursery/noSecrets: Public SHA-256 terminology fingerprint; not a credential.
  '50e9c5e97d44c5f95f38efc7f5a74acb7f9c8e915e2197b5f980949f56a394d1',
  // biome-ignore lint/nursery/noSecrets: Public SHA-256 terminology fingerprint; not a credential.
  'b943a7e15dc1576dc3b9222f4267da507ff26f153f782290f0641f92de99a1eb',
  // biome-ignore lint/nursery/noSecrets: Public SHA-256 terminology fingerprint; not a credential.
  '8d6fe6d5e03386c5a02116263f9bb8f84a3f0edb9e0668f7364f4cd6d19a7e7b'
])
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex')
const normalize = (value: string) =>
  value
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
const termsFile = process.env.DOCS_PRIVATE_TERMS_FILE
if (termsFile) {
  for (const term of readFileSync(termsFile, 'utf8').split(/\r?\n/)) {
    if (term.trim() && !term.startsWith('#'))
      protectedHashes.add(digest(normalize(term)))
  }
}
function containsProtectedTerm(value: string) {
  const text = value.normalize('NFKC').toLowerCase()
  const candidates = new Set(text.match(/[a-z0-9]+(?:[-_][a-z0-9]+)*/g) || [])
  const words = text.match(/[a-z0-9]+/g) || []
  for (let index = 0; index < words.length; index++) {
    candidates.add(words[index])
    for (
      let length = 2;
      length <= 4 && index + length <= words.length;
      length++
    )
      candidates.add(words.slice(index, index + length).join('-'))
  }
  return [...candidates].some((candidate) =>
    protectedHashes.has(digest(normalize(candidate)))
  )
}

const trackedFiles = new Set(
  execFileSync('git', ['ls-files', '--cached', '-z'], {
    cwd: root,
    encoding: 'utf8'
  })
    .split('\0')
    .filter(Boolean)
)
const files = new Set(
  execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: root, encoding: 'utf8' }
  )
    .split('\0')
    .filter(Boolean)
)
let failures = 0
let textFiles = 0
let binaryFiles = 0
for (const file of files) {
  const path = resolve(root, file)
  const fileLabel = containsProtectedTerm(file)
    ? `[file:${digest(file).slice(0, 12)}]`
    : JSON.stringify(file)
  const fail = (category: string) => {
    console.error(`public-boundary FAIL: ${fileLabel}: ${category}`)
    failures++
  }
  let stats: ReturnType<typeof lstatSync>
  try {
    stats = lstatSync(path)
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code === 'ENOENT' &&
      trackedFiles.has(file)
    )
      continue // A tracked deletion is absent from the candidate tree.
    fail('candidate file could not be inspected')
    continue
  }
  if (stats.isSymbolicLink()) {
    fail('external or symbolic file requires explicit review')
    continue
  }
  if (relative(root, realpathSync(path)).startsWith('..')) {
    fail('external or symbolic file requires explicit review')
    continue
  }
  if (!stats.isFile()) {
    fail('unsupported tracked file type')
    continue
  }
  const data = readFileSync(path)
  if (data.includes(0)) {
    binaryFiles++
    continue
  }
  textFiles++
  if (containsProtectedTerm(`${file}\n${data.toString('utf8')}`))
    fail('protected terminology requires removal or owner review')
}
if (failures) process.exit(1)
console.log(
  `public-boundary PASS (${textFiles} text files; ${binaryFiles} binary assets require separate review)`
)
