import { readFileSync } from 'node:fs'

const files = process.argv.slice(2)
let failed = false

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  if (!text.endsWith('\n')) {
    console.error(`${file}: must end with a newline`)
    failed = true
  }
  text.split('\n').forEach((line, index) => {
    if (/\s+$/.test(line)) {
      console.error(`${file}:${index + 1}: trailing whitespace`)
      failed = true
    }
  })
  if (/^content\//.test(file) && /\.(md|mdx)$/.test(file)) {
    const fm = text.match(/^---\n([\s\S]*?)\n---/)
    if (
      !fm ||
      !/^title:\s*\S+/m.test(fm[1]) ||
      !/^description:\s*\S+/m.test(fm[1])
    ) {
      console.error(
        `${file}: content pages require title and description frontmatter`
      )
      failed = true
    }
  }
}

if (failed) process.exit(1)
