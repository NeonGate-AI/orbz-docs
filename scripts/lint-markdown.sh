#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)
exec node "$ROOT/scripts/lint-markdown.ts" "$@"
