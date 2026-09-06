#!/bin/sh
set -eu
HOOK_DIR=$(CDPATH= cd -P "$(dirname "$0")" && pwd)
exec node "$HOOK_DIR/editor-guardrails.ts" afterFileEdit
