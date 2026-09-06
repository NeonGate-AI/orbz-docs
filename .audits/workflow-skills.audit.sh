#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)
exec node "$ROOT/scripts/check-skills.ts" "${DOCS_AUDIT_ROOT:-${GITHUB_WORKSPACE:-$ROOT}}"
