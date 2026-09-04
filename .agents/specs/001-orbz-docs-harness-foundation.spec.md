---
id: SPEC-001
title: Rebuild the Orbz Docs engineering harness
type: governance
status: implemented
mode: prospective
created: 2026-09-04
updated: 2026-09-04
owners:
  - NeonGate AI
targets:
  - .agents
  - .audits
  - .github
  - package.json
  - git hooks
context:
  - .agents/context/repository.md
  - .agents/context/web-quality.md
rules:
  - .agents/rules/001-architecture.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
skills:
  - .agents/skills/spec-driven-development/SKILL.md
  - .agents/skills/context-engineering/SKILL.md
evidence:
  - .audits/architecture.audit.sh
  - .audits/rules.audit.sh
  - .audits/specs.audit.sh
  - .audits/workflow-skills.audit.sh
  - .audits/content.audit.sh
  - .audits/web-quality.audit.sh
  - .audits/git-workflow.audit.sh
---

# SPEC-001: Rebuild the Orbz Docs engineering harness

## Problem Statement

The repository received a harness copied from an unrelated application. It
contained architecture, workflow and audit assumptions for unrelated workspaces,
which made agent guidance and CI misleading even though the Nextra application
itself was already coherent.

## Solution

Rebuild the durable harness around the actual standalone Nextra documentation
site while preserving the existing skill catalog. Add documentation-specific
context, rules, roles, ADRs, specs, audits, Conventional Commit hooks and CI
checks. Remove unrelated product meaning rather than deleting reusable workflow
capabilities.

## Scope

- `.agents/` context, rules, skills, roles, prompts, ADRs and specs.
- `.audits/` reproducible repository/content/web-quality checks.
- Commitlint, lint-staged and Husky configuration.
- CI and PR template alignment with the docs repository.
- Root contributor/agent documentation for the harness.

No Orbz Web Component behavior or framework sandbox behavior is implemented here.

## Testing Decisions

### Primary seam

Run the executable `.audits/*.audit.sh` suite against repository source.

### Secondary seams

Run Biome, TypeScript and Next.js/Nextra production build through `pnpm check`.
Commit-message and staged-file behavior is enforced through Husky hooks when the
corresponding dev dependencies are installed.

The dependency manifest uses exact versions. Because this archive was built in an
isolated environment without npm-registry DNS, the new dependency subtree could
not be regenerated into `pnpm-lock.yaml` here. Networked CI/Vercel bootstrap with
`--no-frozen-lockfile`; the next maintainer with registry access must commit the
refreshed lockfile and return those installs to frozen mode.

## Acceptance Criteria

- [x] No harness rule/spec/audit describes unrelated product workspaces as repository truth.
- [x] Existing local skills remain present and are specialized for Orbz Docs.
- [x] Every `.agents/` and `.audits/` directory has explanatory README content.
- [x] Rules cover Nextra architecture, content accuracy, A11y, SEO, CWV/performance and security.
- [x] `.audits/` mechanically checks harness consistency, MDX metadata/internal links and SEO wiring.
- [x] Husky hooks invoke lint-staged and Commitlint using Conventional Commits.
- [x] CI runs harness checks before static/build validation.
- [x] Git workflow audit verifies Commitlint, lint-staged, Husky and CI wiring.
- [x] Specs/ADRs describe the repository rather than the source project from which the harness was ported.

## Failure Behavior

Harness checks fail closed with a non-zero exit code and a path-oriented message.
A quality claim that requires unavailable runtime/field evidence remains explicitly
unverified rather than being inferred from static checks.

## Out of Scope

- Production RUM/CrUX/Search Console integration.
- Changes to Orbz package runtime behavior.
- Redesign of current documentation content or visual system.

## Evidence and Promotion

The completed harness, executable audit scripts and repository CI are the durable
evidence. Future quality findings should be promoted to a rule/ADR/spec only when
they represent lasting repository truth.
