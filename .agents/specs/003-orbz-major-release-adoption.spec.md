---
id: SPEC-003
title: Adopt the published Orbz 1.0.0 release
type: feature
status: in-progress
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - NeonGate AI
targets:
  - published Orbz dependency and lockfile
  - changelog and current CDN examples
  - documentation public-contract snapshot
context:
  - .agents/context/repository.md
  - .agents/context/orbz-public-contract.md
rules:
  - .agents/rules/001-architecture.rule.md
  - .agents/rules/004-content-contracts.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - .audits/content.audit.sh
  - package.json
  - pnpm-lock.yaml
  - content/orbz/changelog.mdx
---

# SPEC-003: Adopt the published Orbz 1.0.0 release

## Problem Statement

The documentation consumes Orbz 0.4.3 after the owner published 1.0.0. Its
changelog omits the stable release, and current CDN recipes still load 0.3.1.
The live documentation must exercise the same released package it describes.

## Solution

Pin the published 1.0.0 package and lockfile, retain native browser registration,
and explain the new voice/configuration contracts in the changelog. The existing
version badge must continue deriving its value from the dependency declaration.

## Scope

Update the package consumer, current CDN recipes, changelog and contract snapshot.
Preserve historical release notes, the current layout and existing live orbs.
The owner authorizes this delivery and its PR merge directly into main; this
repository has no staging promotion step.

The first full gate reproduced six existing Biome errors in the unchanged
baseline: decorative custom elements were treated as focusable, and four public
navigation/header strings triggered secret detection. Make decorative tab-order
intent explicit and document only those four reviewed false positives inline.
Keep rule severity, public copy and all security-header values unchanged.

## Decisions and Constraints

Use the npm package, not a local product build. Keep exact dependency versions.
Provider keys never belong in component attributes, public config or examples.
Existing visual examples remain silent and require no microphone permission.
Public API claims must match the installed 1.0.0 declarations and release README.

## Testing Decisions

### Primary seam

The production Docs page displays version 1.0.0 and registers/renders its native
orb-z elements using the installed package. The changelog exposes the new entry.

### Required validation

Run pnpm check and the existing content audit. Verify the exact dependency and
lock resolution, changelog ordering, stable-version wording and CDN pin alignment.
Inspect the built site in a browser for registration, visible orbs, version badge
and changelog. Obtain green CI and applicable Vercel status before main merge.

## Acceptance Criteria

- [x] Dependency, lockfile, version badge and current CDN examples use 1.0.0.
- [x] Changelog describes supported additions and credential ownership accurately.
- [x] Historical release notes remain intact and the contract snapshot is current.
- [x] Production build, static gates and content checks pass.
- [ ] Browser inspection confirms native registration and visible rendering.
- [ ] Accessibility, metadata, static rendering and permission boundaries are preserved.
- [ ] Standards and spec-fidelity reviews pass on the final PR head.

## Failure Behavior

An unavailable package, failed build, registration error or failed deployment
blocks merge. Correct the consumer integration without changing the Orbz package
or weakening docs security headers. Revert this bounded update if rollback is
required after deployment.

## Out of Scope

Voice-provider calls, microphone access, backend session authorization, framework
sandbox upgrades, unrelated Dependabot PRs and the unfinished SPEC-002 work.
Rendering checks do not establish voice quality, WCAG conformance or field CWV.

## Evidence and Promotion

Transient logs belong in .audits. Preserve durable source checks in the existing
content audit and record the final validation/review head in the PR. Promote only
verified public-contract changes to the snapshot; no architecture change or new
ADR is needed.

Local evidence on 2026-09-06: frozen installation resolved the published 1.0.0
tarball; pnpm check passed with five existing CSS warnings and no errors; explicit
pnpm postbuild indexed all 19 documentation pages. Historical entries were
compared byte-for-byte with main. The content audit failed on the old mismatched
CDN pins and passes with the release aligned. The browser cannot access the
local server in this environment; live rendering will be checked on the Vercel
preview before merge. Final CI, browser and review evidence belongs in the PR.
