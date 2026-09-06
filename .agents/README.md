# Agent Harness

`.agents/` is the durable engineering context for Orbz Docs. It is intentionally
separate from product content in `content/` and temporary audit output in
`.audits/`.

| Area | Purpose |
|---|---|
| `context/` | Repository facts, boundaries and maps. |
| `rules/` | Durable constraints that changes must obey. |
| `specs/` | Numbered behavioral contracts and delivery workflow. |
| `adrs/` | Accepted architectural decisions and trade-offs. |
| `skills/` | Reusable procedures for execution and review. |
| `roles/` | Review lenses and responsibility boundaries. |
| `workflows/` | Reusable sequences for development, review and delivery. |
| `prompts/` | Skeletons for creating harness artifacts. |

Do not store transient command output here. Put temporary evidence under
`.audits/` and promote only durable conclusions back into this harness.
