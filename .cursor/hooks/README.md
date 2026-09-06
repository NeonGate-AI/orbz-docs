# Local editor hooks

`guard-shell.sh` reviews a proposed shell command without executing it. It denies
obvious root/home deletion, Git-hook bypasses and direct credential dumps; asks
for review of malformed payloads, outside-repository scope and destructive
history/registry commands; and allows ordinary commands. Routine pushes and
merges retain the session's authorization. Approval is still required whenever
the user has not authorized an action.

These are conservative lexical heuristics. Encoded commands, indirect scripts,
other file-reading tools and shell interpretation are not comprehensively
analyzed. They cannot prove that a command is safe or protect credentials from a
compromised editor. Never place secrets in submitted commands.

`feedback-edit.sh` checks one existing source/configuration file with the already
installed local Biome binary. It rejects paths and symlinks outside the repository,
skips generated/dependency files, makes no edits and uses a three-second timeout.
It never installs dependencies, accesses the network or runs the full build. A
failed/skipped check is advisory; `pnpm check` remains the merge gate.

Both entrypoints use the typed backend `editor-guardrails.ts` on Node.js 24.
Protocol: stdin JSON, stdout JSON, generic advisory diagnostics on stderr.
The shell hook fails closed if the process crashes; invalid input requests
manual review. The edit hook always completes with an empty result.

Protocol reference: [Cursor hooks](https://cursor.com/docs/hooks), checked
2026-09-06. Its current response fields are `user_message` and `agent_message`.
