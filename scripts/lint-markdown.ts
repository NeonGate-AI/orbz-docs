import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

let failed = false
for (const file of process.argv.slice(2)) {
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
  const localPath = relative(process.cwd(), resolve(file)).replaceAll('\\', '/')
  if (/^content\//.test(localPath) && /\.(md|mdx)$/.test(file)) {
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (
      !frontmatter ||
      !/^title:\s*\S+/m.test(frontmatter[1]) ||
      !/^description:\s*\S+/m.test(frontmatter[1])
    ) {
      console.error(
        `${file}: content pages require title and description frontmatter`
      )
      failed = true
    }
  }
}
if (failed) process.exit(1)
