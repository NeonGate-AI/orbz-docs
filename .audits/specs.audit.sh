#!/bin/sh
set -eu
ROOT=${GITHUB_WORKSPACE:-$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)}
SPECS="$ROOT/.agents/specs"
TMP=${TMPDIR:-/tmp}/orbz-docs-specs.$$
trap 'rm -f "$TMP"' EXIT HUP INT TERM
: > "$TMP"
fail=0
bad(){ printf 'specs FAIL: %s\n' "$1" >&2; fail=$((fail+1)); }
for f in "$SPECS"/[0-9][0-9][0-9]-*.spec.md; do
  [ -f "$f" ] || continue
  base=${f##*/}
  printf '%s\n' "$base" | grep -Eq '^[0-9]{3}-[a-z0-9]+(-[a-z0-9]+)*\.spec\.md$' || bad "invalid filename: $base"
  for key in id title type status mode created updated owners targets context rules adrs skills evidence; do
    grep -Eq "^$key:" "$f" || bad "$base missing frontmatter key $key"
  done
  id=$(sed -n 's/^id:[[:space:]]*//p' "$f" | head -1)
  printf '%s\n' "$id" | grep -Eq '^SPEC-[0-9]{3}$' || bad "$base has invalid id $id"
  grep -Fx "$id" "$TMP" >/dev/null 2>&1 && bad "duplicate spec id $id"
  printf '%s\n' "$id" >> "$TMP"
  status=$(sed -n 's/^status:[[:space:]]*//p' "$f" | head -1)
  printf '%s\n' "$status" | grep -Eq '^(draft|ready|in-progress|implemented|superseded|retired)$' || bad "$base has invalid status $status"
  grep -F "($base)" "$SPECS/readme.md" >/dev/null || bad "$base missing from spec catalog"
done
[ "$fail" -eq 0 ] || exit 1
printf 'specs PASS\n'
