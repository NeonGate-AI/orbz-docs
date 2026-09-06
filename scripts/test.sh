#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)
cd "$ROOT"
exec node --test scripts/*.test.ts
