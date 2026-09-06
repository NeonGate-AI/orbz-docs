#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
fail=0
bad(){ printf 'git-workflow FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }

for path in package.json commitlint.config.mjs lint-staged.config.mjs .husky/pre-commit .husky/commit-msg .github/workflows/ci.yml; do
  [ -f "$ROOT/$path" ] || bad "missing Git workflow surface: $path"
done

node - "$ROOT/package.json" <<'NODE'
const fs = require('node:fs')
const pkg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const required = ['@commitlint/cli', '@commitlint/config-conventional', 'husky', 'lint-staged']
const missing = required.filter((name) => !pkg.devDependencies?.[name])
if (missing.length) {
  console.error('git-workflow FAIL: missing devDependencies: ' + missing.join(', '))
  process.exit(2)
}
if (pkg.scripts?.prepare !== 'husky') {
  console.error('git-workflow FAIL: package prepare script must run husky')
  process.exit(2)
}
if (pkg.bin || pkg.devDependencies?.['@neongate-ai/neon']) {
  console.error('git-workflow FAIL: documentation automation must not introduce an engineering CLI')
  process.exit(2)
}
if (!pkg.scripts?.test?.includes('sh scripts/test.sh')) {
  console.error('git-workflow FAIL: behavioral shell test entrypoint is required')
  process.exit(2)
}
NODE

if find "$ROOT/scripts" "$ROOT/.cursor/hooks" -type f \( -name '*.mjs' -o -name '*.cjs' -o -name '*.js' \) -print | grep . >/dev/null; then
  bad 'repository automation requires shell entrypoints and typed backends'
fi

grep -F "@commitlint/config-conventional" "$ROOT/commitlint.config.mjs" >/dev/null || bad 'Commitlint must extend the conventional configuration'
grep -F 'lint-staged' "$ROOT/.husky/pre-commit" >/dev/null || bad 'pre-commit hook must invoke lint-staged'
grep -F 'commitlint' "$ROOT/.husky/commit-msg" >/dev/null || bad 'commit-msg hook must invoke Commitlint'
grep -F 'biome check --write' "$ROOT/lint-staged.config.mjs" >/dev/null || bad 'lint-staged must run Biome for source/config files'
grep -F 'sh scripts/lint-markdown.sh' "$ROOT/lint-staged.config.mjs" >/dev/null || bad 'lint-staged must validate staged Markdown/MDX'
grep -F 'pnpm exec commitlint' "$ROOT/.github/workflows/ci.yml" >/dev/null || bad 'CI must validate Conventional Commit history'

[ -x "$ROOT/.husky/pre-commit" ] || bad '.husky/pre-commit must be executable'
[ -x "$ROOT/.husky/commit-msg" ] || bad '.husky/commit-msg must be executable'

[ "$fail" -eq 0 ] || exit 1
printf 'git-workflow PASS\n'
