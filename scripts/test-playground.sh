#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)
cd "$ROOT"
exec node --experimental-strip-types --test tests/home-playground-voice.test.ts
