---
id: SPEC-012
title: Align Docs with the published Orbz 1.0.2 correction
type: enhancement
status: implemented
mode: prospective
created: 2026-09-08
updated: 2026-09-08
owners:
  - gojhonny
targets:
  - published dependency and current release labels
  - NeonGate documentation and changelog
  - release alignment checks and public-contract context
context:
  - .agents/context/repository.md
  - .agents/context/orbz-public-contract.md
rules:
  - .agents/rules/004-content-contracts.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/harness-maintenance/SKILL.md
  - .agents/skills/writing-for-agents/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - package.json
  - pnpm-lock.yaml
  - content/orbz/changelog.mdx
  - content/orbz/concepts/appearance.mdx
  - .audits/content.audit.sh
---

# SPEC-012: Align Docs with the published Orbz 1.0.2 correction

## Problem Statement

Orbz 1.0.2 is now published, but Docs still consumes 1.0.1 and describes the
NeonGate correction as pending. Current CDN URLs, version labels and the newest
changelog entry are stale. The CDN introduction also incorrectly names 0.3.1,
which the existing URL-only release check does not detect.

## Solution

Adopt the exact registry package and describe the verified canonical NeonGate
name and backward compatibility. Keep public release labels, source-tag links,
current examples and the harness snapshot consistent with that dependency.

## Scope

Bump the private Docs application from 0.1.1 to 0.1.2 and its exact Orbz pin to
1.0.2. Refresh only the affected lock resolution. Update current preset guidance,
the CDN introduction and pins, and prepend product release notes. Extend existing
release checks with regression fixtures for the concrete stale-version gaps.
Correct verified product/Docs repository identifiers in current harness routing.

## Decisions and Constraints

- The owner authorizes this release-alignment update. PR #11 merged into staging
  during preparation; deliver a new PR against that merged state, preserving
  SPEC-011's favicon, metadata and labels. No merge or production deployment is
  part of this delivery.
- Preserve npm scope, GitHub owner and independent product/Docs versions.
- Registry latest is 1.0.2. Product tag v1.0.2 already points to main commit
  6655c0904b713829790de70f5a86e11d5678df91. Verify and link existing product tags;
  never move them. Docs has no Git tags or GitHub releases. Its displayed version
  tags remain derived from the product dependency, without inventing a Docs
  production release for an unmerged PR.
- Preserve the changelog byte for byte from the 1.0.1 heading onward. Historical
  specifications remain evidence of their original package versions.
- The canonical default is neongate. The published gojhonny compatibility alias
  remains deprecated, accepted and normalized; it is not a seventh palette.
- Preserve portable default examples, routes, static rendering, icons, controls,
  security headers, explicit speech activation and provider boundaries.

## Testing Decisions

### Primary seam

Published package exports plus authored and production-generated release content:
the dependency, changelog, current CDN prose/pins, contract snapshot and version
labels agree. Preset documentation matches the installed canonical list/default.

### Required validation

Verify registry integrity, exact installed exports and product tag target. Add
isolated positive/negative release-alignment fixtures, including stale CDN prose
and contract snapshots, then run the full pnpm check and dependency audit. Verify
generated labels and new release notes, and preserve historical changelog bytes.
Run the same pinned harness scorer before/after and state its limitations.
Record independent Standards and Spec-fidelity reviews and CI on the final head.

## Acceptance Criteria

- [x] Docs 0.1.2 consumes exact published Orbz 1.0.2 with its verified integrity.
- [x] Current labels, CDN prose/pins and newest changelog agree with the dependency.
- [x] Preset guidance and harness context describe the published NeonGate correction.
- [x] Release links resolve to verified existing product tags; history is preserved.
- [x] Regression fixtures catch stale release content and the full gates pass.
- [x] Generated-page checks preserve SPEC-011; evidence limits are recorded.

## Failure Behavior

An unavailable or mismatched package, stale content or failed check blocks the
update. Existing immutable npm versions and Git tags are never overwritten.
If the PR head changes during delivery, rebase the proposed delta and repeat
review rather than overwriting another change.

## Out of Scope

Product publication or source changes, framework upgrades, a new Docs release
pipeline, tag mutation, PR merge, provider requests, browser speech testing,
redesigns and field Core Web Vitals or WCAG conformance claims.

## Evidence and Promotion

Temporary reports remain in .audits. Promote verified package semantics to the
public-contract snapshot and reusable release consistency checks to the existing
content/build audit seams. Record final source trees, reviews and remote checks
in the new staging PR. Static docs and dependency adoption add no client boundary or service;
existing SEO, accessibility and performance gates remain applicable.

Lifecycle: the owner-requested contract was marked ready before implementation,
then moved to in-progress. Validation completed on 2026-09-08 with Node 24.19.0
and pnpm 10.32.1:

- npm latest resolves to 1.0.2, published at 08:42:14.230 UTC. Its registry
  integrity matches the lockfile; the frozen install changed only Orbz's package
  resolution. The private Docs version is 0.1.2.
- Installed exports confirm the neongate default, six canonical names, unchanged
  colors and the accepted gojhonny alias normalized to neongate. Its palette alias
  is non-enumerable, non-writable and non-configurable, sharing the same object.
- Eight focused release fixtures pass. The new checker rejects the preserved
  pre-update content for stale CDN introduction, pins, newest changelog and
  snapshot version/default/list. Tests also cover absent or moving pins and a
  duplicate or seventh alias palette.
- pnpm check passes: all source audits, 41 tests, formatting, lint, TypeScript,
  production build, Pagefind and metadata/icon/label audits of all 19 pages.
  Five existing CSS warnings remain; no stylesheet changed.
- pnpm security:audit reports no known production dependency vulnerabilities.
- Every generated page displays v1.0.2. The new changelog anchor and v1.0.2
  source/compare links exist in generated HTML; the home title remains
  Orbz — AI Voice Web Component.
- Historical changelog content from the 1.0.1 heading onward is byte-identical:
  19,714 bytes, SHA-256 cd60d5508fd334067df49d75880d94a60189dced0178cd7a7df4a3344f0e6c54.
- Product v1.0.2 resolves to 6655c0904b713829790de70f5a86e11d5678df91;
  v1.0.1 resolves to 27f1a89703a8a85c538eae6455c285c6b8133de1. Docs has no
  Git tags. No immutable reference was changed or invented.
- harness-score 1.6.5 reports L4, 103/108 (95%) before and after. Dimensions and
  level are unchanged; the additional regression coverage is not a claimed
  maturity increase. The heuristic score does not replace executable checks.

Evidence is installed-package, source and production-build evidence. This update
does not exercise speech, browsers, assistive technology or field performance.
Final independent Standards/Spec reviews, reviewed source tree and remote CI
belong in the new PR against staging; implementation completion does not
authorize merge or deployment.
