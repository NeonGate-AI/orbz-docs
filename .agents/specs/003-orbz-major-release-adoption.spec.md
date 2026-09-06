---
id: SPEC-003
title: Adopt the published Orbz 1.0.0 release
type: feature
status: implemented
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

Validation-sequence revision, 2026-09-06: the local browser cannot access the
development server, and the Vercel connection lacks access to this team's
protected preview. Respect both access boundaries. Under the owner's existing
authorization to deploy directly through main, inspect the public production
site immediately after the green, reviewed merge. Keep this spec in-progress
until that browser evidence is recorded, then close it in a documentation-only
follow-up. This changes the verification order, not its acceptance criteria.

## Acceptance Criteria

- [x] Dependency, lockfile, version badge and current CDN examples use 1.0.0.
- [x] Changelog describes supported additions and credential ownership accurately.
- [x] Historical release notes remain intact and the contract snapshot is current.
- [x] Production build, static gates and content checks pass.
- [x] Browser inspection confirms native registration and visible rendering.
- [x] Accessibility, metadata, static rendering and permission boundaries are preserved.
- [x] Standards and spec-fidelity reviews pass on the final PR head.

## Failure Behavior

An unavailable package, failed build, registration error or failed deployment
blocks delivery. Build and deployment failures block merge; a browser failure
after promotion keeps this spec open and requires a fix or rollback. Correct
the consumer integration without changing the Orbz package
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
production site after the authorized main merge. The initial PR CI and Vercel
deployment passed. The initial branch-creation push rechecked an old main commit
and failed its historical body length; this release commit passed commitlint.
Final CI, browser and review evidence belongs in the PR.

Production acceptance completed on 2026-09-06 after PR #5 merged as
`b424fd5c010a7ffa76bd0929b9890cd1459a8a4b`. Both final-head CI runs and Vercel
passed for `f96e493d3a82462d3701da7740d9ebf1b219d781`; independent Standards and
Spec-fidelity reviews passed for that same head with the sequence exception
documented. The production Vercel deployment also passed.

Browser inspection of https://orbz.site confirmed the v1.0.0 badge and all three
native orb-z elements registered with nonzero dimensions. A screenshot confirmed
the visible main orb; decorative elements retain aria-hidden and tabIndex -1.
The rendered changelog exposes the 1.0.0 entry and preserved older entries, and
the current CDN guide renders 1.0.0 pins. No application-origin console errors
were observed during this production inspection; unrelated browser-extension
and earlier Vercel-login messages were excluded. No microphone or provider call
was initiated. These observations establish this Docs integration's rendering,
not voice-provider behavior, full WCAG conformance or field CWV.

This documentation-only closure records the completed post-deployment criteria.
Its final head must independently pass the existing CI and both review axes.
