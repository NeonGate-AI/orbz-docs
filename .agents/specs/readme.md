# Specification Catalog

Numbered specs are durable bounded contracts. The filename prefix is stable
priority/order for this small repository; the frontmatter `id` is the durable
identity.

| File | ID | Status | Contract |
|---|---|---|---|
| [000](000-orbz-docs-site-baseline.spec.md) | SPEC-000 | implemented | Retrospective standalone Nextra site baseline |
| [001](001-orbz-docs-harness-foundation.spec.md) | SPEC-001 | implemented | Orbz Docs harness foundation |
| [002](002-docs-quality-hardening.spec.md) | SPEC-002 | in-progress | OrbZ docs quality hardening |
| [003](003-orbz-major-release-adoption.spec.md) | SPEC-003 | implemented | Adopt published Orbz 1.0.0 in the live Docs and changelog |

Support files:

- `template.md`: canonical spec skeleton.
- `workflow.md`: lifecycle and evidence rules.

Create a new spec for new behavior; do not rewrite an implemented spec to make a
later change look historical.
