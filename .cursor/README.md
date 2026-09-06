# Optional Cursor adapter

Cursor users can use the project hooks and focused reviewer here. Other editors
and CI continue to use `AGENTS.md` and ordinary pnpm commands. Node.js 24 and a
POSIX shell are required; no extra service, account or CLI is installed.

The adapter is enabled when Cursor loads `.cursor/hooks.json`. To opt out locally,
remove its hook entries from your local editor configuration; do not weaken CI.
Hook execution outside Cursor is covered by `pnpm test`.

- [Hooks](hooks/README.md): shell review and advisory feedback after an edit.
- [Reviewer](agents/docs-reviewer.md): independent review, without mutations.

The hooks are supplemental checks, not a security boundary or a replacement for
session authorization, repository rules, review and `pnpm check`.
