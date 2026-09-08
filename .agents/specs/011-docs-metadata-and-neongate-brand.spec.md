---
id: SPEC-011
title: Repair Docs identity, metadata and accessible controls
type: fix
status: implemented
mode: prospective
created: 2026-09-08
updated: 2026-09-08
owners:
  - gojhonny
targets:
  - favicon assets and page metadata
  - speech and search accessible names
  - NeonGate preset documentation
  - staging CI and rendered-page regression checks
context:
  - .agents/context/repository.md
  - .agents/context/content-architecture.md
  - .agents/context/web-quality.md
  - .agents/context/orbz-public-contract.md
rules:
  - .agents/rules/004-content-contracts.rule.md
  - .agents/rules/006-accessibility.rule.md
  - .agents/rules/007-seo.rule.md
  - .agents/rules/008-performance-core-web-vitals.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
  - .agents/adrs/0003-static-compatible-content-security-policy.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/seo/SKILL.md
  - .agents/skills/accessibility/SKILL.md
  - .agents/skills/core-web-vitals/SKILL.md
  - .agents/skills/performance/SKILL.md
  - .agents/skills/web-quality-audit/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - app/layout.tsx
  - app/[[...mdxPath]]/page.tsx
  - app/home-playground.controls.tsx
  - .audits/web-quality.audit.sh
  - .github/workflows/ci.yml
---

# SPEC-011: Repair Docs identity, metadata and accessible controls

## Problem Statement

The owner reports missing favicon and repeated homepage branding in page titles.
Production currently exposes only a glyph data URI and returns 404 for favicon.ico.
The current server title is not duplicated, but title formatting is split across
layout and social metadata, with no rendered-output regression coverage. Source
and generated HTML also reveal an unnamed speech input and search controls.

The owner additionally corrects the preset identity: it is NeonGate, unrelated to
the gojhonny GitHub account. Published Orbz 1.0.1 accidentally renamed its default
literal. A separate product PR restores the canonical API name with compatibility
for consumers of 1.0.1; these docs must not pretend that fix is already on npm.

## Solution

Serve real compact icons derived from the existing orb brand asset. Give the
homepage one descriptive brand title and keep browser/social titles consistent.
Provide visible speech labeling and an explicit search accessible name. Restore
NeonGate terminology using version-independent default examples while accurately
documenting the still-published 1.0.1 literal in one migration note.

## Scope

Metadata, favicon files, homepage description/navigation label, accessible form
names, current default-preset examples and the public-contract snapshot. Add a
production-output audit for metadata, icons and accessible names, with regression
fixtures. Enable the existing CI gate for staging PRs and pushes.

## Decisions and Constraints

- The owner explicitly requests a PR against staging, superseding the default
  direct-main rule for this delivery. No merge or production deployment is authorized.
- Branch from main's merged SPEC-010 release update; the PR also brings that
  already-reviewed release content into the lagging staging branch.
- Homepage and /orbz alias use `Orbz — AI Voice Web Component`, without an appended
  Docs suffix. Leaf pages append the Docs brand once and use matching social titles.
- Preserve the existing orb artwork, social preview, routes, canonicals, search,
  theme, security headers and explicit speech activation. No new dependency.
- Preserve npm `@neongate-ai/orbz@1.0.1` until a corrected package is published.
  Default HTML examples omit the preset attribute; typed examples use
  DEFAULT_ORBZ_PRESET. NeonGate is the brand; the actual 1.0.1 literal is clearly
  version-qualified where necessary. Historical changelog entries stay intact.
- No speculative performance refactor, provider request or tracking integration.

## Testing Decisions

### Primary seam

Production HTML and icon responses: one correct title, matching social metadata,
canonical/indexing consistency, real favicon discovery and named inputs.

### Required validation

Demonstrate the new rendered-output check fails on the old favicon/unnamed-field
baseline. Run focused positive/negative fixtures, pnpm check and the production
dependency audit. Verify all generated docs pages and representative production
HTTP responses. Attempt browser checks for title, icon, labeling and keyboard
focus without starting speech; record environment limits. Keep field Core Web
Vitals and full WCAG conformance separate from source/build/browser observations.

## Acceptance Criteria

- [x] Browsers can discover compact real orb favicon and touch-icon assets.
- [x] Home/alias titles are consistent and brand text is not duplicated.
- [x] Every generated docs page has matching browser/social metadata and canonical.
- [x] Speech and search inputs have explicit accessible names; speech status is associated.
- [x] NeonGate naming is restored without unsupported claims about installed 1.0.1.
- [x] Existing rendering, metadata, privacy and motion protections are preserved.
- [x] Regression fixtures, full gate and dependency audit pass; evidence limits are recorded.
- [x] Staging PRs and pushes retain the full CI gate; final reviews are recorded in the PR.

## Failure Behavior

Missing icons, repeated titles, incorrect canonicals or unnamed controls fail the
build gate. A missing browser capability is disclosed rather than represented as
successful visual or interaction testing. A failed required CI blocks merge.
Package naming guidance remains version-qualified until the product fix is released.

## Out of Scope

Publishing an Orbz patch, changing GitHub ownership/npm scope, modifying historical
release notes, redesigning the homepage, new routes or analytics, search-ranking
claims, blanket accessibility certification and field Core Web Vitals claims.

## Evidence and Promotion

Temporary audit logs stay in .audits. Promote stable metadata/label checks to the
build audit and document ownership in content architecture. Record final commits,
CI, browser limits and the separate preset-restoration PR in the delivery PR.

The current baseline already has valid robots, sitemap, canonicals and social
metadata. The requested title repetition was not reproduced in current server
HTML. This spec improves deterministic ownership and prevents recurrence; it
does not claim all SEO was previously absent.


Validation completed on 2026-09-08 with Node 24.19.0 and pnpm 10.32.1:

- Live browser inspection confirmed the old title was already nonduplicated,
  the favicon was a data-URI glyph, and the active speech field lacked a label.
- Nine new positive/negative regression fixtures pass. Running the new audit
  against the preserved old build reproduced missing real icons, unnamed search
  and speech controls, missing status association and the new homepage title.
- `pnpm check` passes all source audits, 33 tests, formatting, lint, TypeScript,
  production build, Pagefind indexing and the new audit of all 19 generated pages.
  Five pre-existing CSS warnings remain; no stylesheets changed.
- `pnpm security:audit` reports no known production dependency vulnerabilities.
- An isolated production-server HTTP check verified the exact home title and
  HTTP 200 responses for favicon.ico, icon.png, apple-icon.png, robots.txt and
  sitemap.xml. Icon responses have correct image MIME types; source PNGs are
  96/180 pixels and ICO includes 16/32/48 pixel frames.
- The icon files are deterministic size/format conversions of the existing
  `assets/images/neongate-sphere.png`; the original artwork is unchanged.
- The cloud browser rejected the local preview with ERR_BLOCKED_BY_CLIENT.
  Updated browser rendering, keyboard interaction and screen-reader behavior
  remain unverified there. Production HTTP and generated markup evidence do not
  replace those checks or establish field Core Web Vitals/WCAG conformance.
- Canonical preset restoration is tracked by
  [Orbz PR #20](https://github.com/gojhonny/orbz/pull/20). Docs stays on the actual
  published 1.0.1 contract, using NeonGate terminology and portable defaults.

The implementation follows Next.js [icon file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
and [absolute title metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#absolute).
Google's [favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search)
informs stable crawlable icon URLs; no search display or ranking result is claimed.

Final independent review results, remote head and CI/deployment status belong in
this delivery's PR against staging.
