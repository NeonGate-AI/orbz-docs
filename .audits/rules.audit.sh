#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
RULES="$ROOT/.agents/rules"
fail=0
bad(){ printf 'rules FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
[ -f "$RULES/readme.md" ] || bad 'missing rules index'
expected='001-architecture 002-code-style 003-context-engineering 004-content-contracts 005-markdown 006-accessibility 007-seo 008-performance-core-web-vitals 009-react-and-next 010-source-organization 011-spec-driven-development 012-security-privacy'
for slug in $expected; do
  f="$RULES/$slug.rule.md"
  [ -f "$f" ] || { bad "missing $slug.rule.md"; continue; }
  grep -Eq '^alwaysApply: true$' "$f" || bad "$slug must be alwaysApply"
  grep -F "($slug.rule.md)" "$RULES/readme.md" >/dev/null || bad "$slug missing from index"
done
count=$(find "$RULES" -maxdepth 1 -type f -name '[0-9][0-9][0-9]-*.rule.md' | wc -l | tr -d ' ')
[ "$count" -eq 12 ] || bad "expected 12 numbered rules, found $count"
[ "$fail" -eq 0 ] || exit 1
printf 'rules PASS\n'
