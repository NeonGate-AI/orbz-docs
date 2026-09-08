---
id: SPEC-010
title: Adopt the published Orbz 1.0.1 patch
type: enhancement
status: implemented
mode: prospective
created: 2026-09-08
updated: 2026-09-08
owners:
  - gojhonny
targets:
  - package metadata and published dependency
  - version labels, CDN examples and changelog
  - current preset examples and public-contract snapshot
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
  - .agents/skills/code-review/SKILL.md
evidence:
  - package.json
  - pnpm-lock.yaml
  - site.config.ts
  - content/orbz/changelog.mdx
  - .audits/content.audit.sh
---

# SPEC-010: Adopt the published Orbz 1.0.1 patch

## Problem Statement

The owner published `@neongate-ai/orbz@1.0.1`, but the Docs dependency, version
badge, CDN examples and newest changelog entry still describe 1.0.0. Current
examples also name the old default preset, which no longer matches the published
TypeScript contract.

## Solution

Consume the exact published patch and align the public release information with
it. Explain the compact configuration, cleanup behavior and preset migration from
the published package and the product's v1.0.0-to-v1.0.1 diff.

## Scope

Update the private Docs application version from 0.1.0 to 0.1.1, pin its Orbz
dependency to 1.0.1, refresh the lockfile and current CDN examples, and prepend a
dated product changelog entry. Keep the existing badge derived from the product
dependency. Update current preset examples and the contract snapshot; correct
current product/Docs GitHub links to the confirmed gojhonny repositories.

## Decisions and Constraints

- The owner authorizes this release-alignment update and remote PR delivery.
- Preserve the npm scope `@neongate-ai/orbz` and the private Docs package name.
- Product npm `latest` already resolves to 1.0.1; product Git tag `v1.0.1` already
  exists. Preserve those references and historical releases. This Docs repository
  has no existing Git tags or package-publishing workflow; its visible product
  version labels continue to derive from the dependency.
- Preserve historical changelog entries byte for byte from the 1.0.0 heading
  onward. Document the `neongate` to `gojhonny` preset migration in the new entry.
- New source stays on a branch based on main, with a PR directly to main under
  the repository delivery rule. Merging and production deployment are separate.

## Testing Decisions

### Primary seam

The production build uses published Orbz 1.0.1 and emits the matching version
badge, current CDN pins and new changelog entry. Current preset examples match
the installed package's supported preset names.

### Required validation

Run a frozen dependency installation and `pnpm check`. Inspect installed package
metadata/exports, generated page markup, current CDN pins, changelog chronology
and preservation of historical entries. Run the existing production dependency
audit, and record independent Standards and Spec-fidelity reviews of the final
head in the PR. CI/deployment status is reported separately from local evidence.

## Acceptance Criteria

- [x] Docs metadata is 0.1.1 and the exact Orbz dependency/lock resolution is 1.0.1.
- [x] Generated version labels and current CDN examples identify Orbz 1.0.1.
- [x] New release notes are verified, dated 2026-09-08 and explain migration.
- [x] Current preset examples and the public-contract snapshot match the package.
- [x] Historical changelog entries and existing release tags remain intact.
- [x] The full repository gate and production dependency audit pass.
- [x] Content accuracy, accessibility, SEO and performance impact are reviewed.

## Failure Behavior

An unavailable package, installation mismatch, stale release label, invalid
preset example or failed required gate blocks completion. Correct the Docs
integration without changing the published product or weakening checks. Revert
this bounded commit to restore the prior Docs dependency/content if necessary.

## Out of Scope

Product code or package publication, new Docs Git release tags, framework sandbox
upgrades, unrelated branding/CSS refactors, navigation or layout changes, provider
requests, microphones, deployment and closing unfinished earlier specs.

## Evidence and Promotion

Retain reproducible package/content/build evidence here and final reviewed-head
and CI results in the PR. Promote only verified contract changes to the existing
snapshot. Static content adds no client boundary, route or external service;
existing semantic markup, metadata, permissions and search remain governed by the
full gate. Build/source evidence does not establish browser playback, full WCAG
conformance or field Core Web Vitals.

Lifecycle: the owner's release-alignment request was recorded as ready before
implementation, then moved to in-progress. Validation completed on 2026-09-08:

- Frozen installation with Node 24.19.0 and pnpm 10.32.1 accepted the exact
  registry-verified Orbz 1.0.1 checksum. Only Orbz's lockfile entry changed;
  the rest of the dependency graph is preserved.
- `pnpm check` passed all harness audits, 24 behavioral tests, formatting, lint,
  TypeScript, production build and Pagefind indexing of 19 pages. Five existing
  CSS lint warnings remain; no changed stylesheet or new warning was introduced.
- `pnpm security:audit` reported no known production dependency vulnerabilities.
- Imported published exports confirm the six supported presets, the `gojhonny`
  default and unchanged five colors. All 23 current literal preset examples
  resolve to a supported name. The installed root API remains importable in Node.
- Generated HTML for `/`, `/orbz`, `/orbz/changelog` and the CDN guide contains
  `v1.0.1`, one main landmark and one h1. The changelog orders the new release
  above 1.0.0; current CDN output contains 1.0.1 and no 1.0.0 package pin.
- Historical changelog content from the 1.0.0 heading onward matches the main
  baseline byte for byte. Product tags were verified read-only and not changed.
- This static content update preserves the existing routing, metadata, layout,
  client boundaries and permissions. Evidence is source/build and registry
  evidence, with no browser, speech-provider, WCAG or field-performance claim.

Final head reviews and CI status are recorded in the delivery PR.
