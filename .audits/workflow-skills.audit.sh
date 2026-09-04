#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
SKILLS="$ROOT/.agents/skills"
fail=0
bad(){ printf 'skills FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
required='accessibility best-practices code-review context-engineering core-web-vitals documentation-and-adrs frontend-ui-engineering implement performance seo spec-driven-development tdd to-spec to-tickets web-quality-audit'
for skill in $required; do
  [ -f "$SKILLS/$skill/SKILL.md" ] || bad "missing skill $skill/SKILL.md"
  [ -f "$SKILLS/$skill/README.md" ] || bad "missing skill $skill/README.md"
  grep -F "$skill" "$SKILLS/readme.md" >/dev/null || bad "$skill missing from catalog"
done
for skill in to-spec implement tdd code-review; do
  grep -F "../skills/$skill/SKILL.md" "$ROOT/.agents/specs/workflow.md" >/dev/null 2>&1 || grep -F "$skill" "$ROOT/.agents/specs/workflow.md" >/dev/null || bad "$skill not referenced by workflow"
done
[ "$fail" -eq 0 ] || exit 1
printf 'skills PASS\n'
