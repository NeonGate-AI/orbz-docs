---
version: 1
name: Context Engineering
description: Rules for keeping the repository harness useful to humans and agents.
alwaysApply: true
priority: high
tags: [harness, context]
---

# Context engineering

- `AGENTS.md` is the primary executable entry point and must remain concise.
- Load context by task using `.agents/context/readme.md`; do not make every file always-on.
- Context records facts; rules record constraints; ADRs record consequential decisions; specs record bounded change contracts.
- Do not duplicate the same normative statement across layers. Link to the owner instead.
- Temporary observations belong in `.audits/`, not context. Promote a conclusion only after it is supported by evidence.
- Every directory under `.agents/` has a README describing its purpose and ownership.

- Reusable sequences live in `.agents/workflows/` and compose the canonical spec lifecycle.
- Executable repository automation uses `.sh` entrypoints. Typed backends are allowed; framework configuration modules remain configuration.
- Use package scripts for this repository; no custom engineering CLI is required.
