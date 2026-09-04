# Audits

`.audits/` contains reproducible repository checkers and temporary audit evidence.
Committed executable checkers end in `.audit.sh`. Generated reports/logs are
ignored by Git and are not canonical engineering context.

Current checkers:

- `architecture.audit.sh`: standalone Nextra/docs topology and forbidden legacy assumptions.
- `rules.audit.sh`: rule catalog identities/frontmatter/index coverage.
- `specs.audit.sh`: numbered spec naming/frontmatter/catalog consistency.
- `workflow-skills.audit.sh`: local skill catalog/invocation references.
- `content.audit.sh`: MDX metadata and internal-route validity.
- `web-quality.audit.sh`: deterministic SEO/accessibility/performance source contracts.
- `git-workflow.audit.sh`: validates Commitlint, lint-staged, Husky hooks and CI wiring.

`pnpm harness:check` runs the full committed suite. Promote durable findings into
`.agents/` or tests; do not keep long-lived truth only in an audit report.
