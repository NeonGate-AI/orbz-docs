#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)
exec node "$ROOT/scripts/check-built-web-quality.ts" "${DOCS_AUDIT_ROOT:-$ROOT}"
