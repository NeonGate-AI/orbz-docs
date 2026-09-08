# Specification Catalog

Numbered specs are durable bounded contracts. The filename prefix is stable
priority/order for this small repository; the frontmatter `id` is the durable
identity.

| File | ID | Status | Contract |
|---|---|---|---|
| [000](000-orbz-docs-site-baseline.spec.md) | SPEC-000 | implemented | Retrospective standalone Nextra site baseline |
| [001](001-orbz-docs-harness-foundation.spec.md) | SPEC-001 | implemented | Orbz Docs harness foundation |
| [002](002-docs-quality-hardening.spec.md) | SPEC-002 | implemented | OrbZ docs quality hardening |
| [003](003-orbz-major-release-adoption.spec.md) | SPEC-003 | implemented | Adopt published Orbz 1.0.0 in the live Docs and changelog |
| [004](004-public-repository-boundary.spec.md) | SPEC-004 | implemented | Remove private-project remnants and enforce the public boundary |
| [005](005-harness-parity-without-cli.spec.md) | SPEC-005 | implemented | Strengthen harness workflows, guardrails and evidence without a Docs CLI |
| [006](006-homepage-voice-playground.spec.md) | SPEC-006 | in-progress | Interactive homepage with native voice examples and visual controls |
| [007](007-public-docs-web-quality.spec.md) | SPEC-007 | in-progress | Accessible, searchable and secure public documentation UI |
| [008](008-homepage-spacing-and-proof.spec.md) | SPEC-008 | implemented | Compact homepage spacing and simplify component proof |
| [009](009-playground-badges-and-navigation.spec.md) | SPEC-009 | implemented | Playground status/badges and responsive package star navigation |
| [010](010-orbz-patch-release-adoption.spec.md) | SPEC-010 | implemented | Adopt published Orbz 1.0.1 and align release labels, examples and changelog |
| [011](011-docs-metadata-and-neongate-brand.spec.md) | SPEC-011 | implemented | Real favicons, consistent titles, accessible controls and NeonGate branding |

Support files:

- `template.md`: canonical spec skeleton.
- `workflow.md`: lifecycle and evidence rules.

Create a new spec for new behavior; do not rewrite an implemented spec to make a
later change look historical.
