---
id: SPEC-002
title: OrbZ docs quality hardening
type: feature
status: in-progress
mode: prospective
created: 2026-09-04
updated: 2026-09-04
owners:
  - NeonGate AI
targets:
  - Nextra application shell
  - generated page metadata
  - documentation quality gates
  - CI and dependency maintenance
context:
  - .agents/context/repository.md
  - .agents/context/web-quality.md
  - .agents/context/orbz-public-contract.md
rules:
  - .agents/rules/006-accessibility.rule.md
  - .agents/rules/007-seo.rule.md
  - .agents/rules/008-performance-core-web-vitals.rule.md
  - .agents/rules/009-react-and-next.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0003-static-compatible-content-security-policy.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/accessibility/SKILL.md
  - .agents/skills/seo/SKILL.md
  - .agents/skills/performance/SKILL.md
  - .agents/skills/best-practices/SKILL.md
evidence:
  - .audits/accessibility.audit.sh
  - .audits/security.audit.sh
  - .audits/performance.audit.sh
  - .audits/web-quality.audit.sh
---

# SPEC-002: OrbZ docs quality hardening

## Problem Statement

The docs shell still exposes the publisher name as the primary top-left wordmark,
does not show the documentation package version beside the product brand, and
has source-level gaps across accessibility, search metadata, static rendering,
HTTP response hardening, dependency reproducibility, and framework-specific
linting. The site also publishes two substantially identical landing pages with
independent canonical URLs.

The quality work must not redesign the documentation. The current layout,
spacing, colors, typography, content hierarchy, and Nextra interaction model are
the visual contract. Only the requested top-left product wordmark and adjacent
version badge may intentionally change the normal rendered appearance.

## Solution

Keep the Nextra Docs Theme and existing presentation intact while hardening the
application at its existing seams:

- render `OrbZ` beside the existing orb mark and derive an adjacent version badge
  from the installed `@neongate-ai/orbz` dependency;
- remove avoidable landmark and hydration problems without changing default
  styling;
- generate page-specific canonical, Open Graph, and Twitter metadata;
- consolidate the duplicate `/orbz` landing page under the root canonical;
- prevent preview deployments from advertising themselves for indexing;
- preserve static content delivery while applying a restrictive, Pagefind-aware
  CSP and defense-in-depth response headers;
- make dependency installation deterministic and add supply-chain maintenance;
- explicitly enable React and Next.js lint domains already available through
  Biome;
- extend repository audits so these guarantees are executable contracts rather
  than prose-only guidance.

## Scope

Owned behavior includes the Nextra root shell, metadata route, robots/sitemap,
Next.js configuration, theme toggle client boundary, generated documentation
examples that model unsafe or inaccessible HTML, CI, dependency update policy,
and harness audits/rules that cover these behaviors.

No application business logic in `@neongate-ai/orbz` is changed.

## Decisions and Constraints

- The normal visual design remains unchanged except for `NeonGate AI` → `OrbZ`
  in the top-left wordmark and the new adjacent version badge.
- The badge version comes from the exact dependency declared in `package.json`,
  not a second manually maintained version string.
- Nextra remains responsible for the document `main` landmark; full-width MDX
  landing pages must not nest an additional `main` element.
- Server Components remain the default. No new global Client Component or
  third-party browser script is introduced.
- `/orbz` remains reachable for existing navigation but declares `/` as its
  canonical and is omitted from the sitemap.
- Pagefind remains enabled with code blocks excluded and therefore the CSP must
  permit Pagefind WebAssembly and its worker without permitting JavaScript
  `eval()` in production.
- A per-request nonce CSP is intentionally not used because it would force
  dynamic rendering and remove the static/CDN characteristics of this public
  documentation site. See ADR-003.
- Security headers must not enable deprecated `X-XSS-Protection`; it is
  explicitly disabled while CSP is used instead.
- CI action references are immutable commit SHAs and checkout credentials are
  not persisted because the validation job does not push.

## Testing Decisions

### Primary seam

The highest seam is a production build plus source-contract audits of the root
shell, metadata generation, response-header configuration, content routes, and
CI configuration.

### Required validation

- repository harness audits pass;
- TypeScript/Biome/build pass in an environment with the pinned pnpm/Node
  toolchain;
- security audit checks headers, immutable CI actions, frozen installs,
  dependency pinning, and common source-level injection/secret hazards;
- accessibility audit checks authored landmarks, interactive element basics,
  decorative OrbZ semantics, reduced-motion behavior, and documented contrast
  pairs;
- web-quality audit checks per-page sharing metadata, canonical consolidation,
  robots/sitemap alignment, and Pagefind configuration;
- manual review confirms no default visual changes outside the requested brand
  label and version badge;
- field Core Web Vitals remain a post-deploy measurement concern and are not
  inferred from source checks.

## Acceptance Criteria

- [x] Top-left brand reads `OrbZ`, keeps the existing orb, and shows the current
      `@neongate-ai/orbz` version immediately to its right.
- [x] No normal visual redesign is introduced.
- [x] Authored landing pages do not nest the Nextra main landmark.
- [x] Decorative shell orbs are hidden from assistive technology and follow the
      system reduced-motion preference.
- [x] Custom interactive UI has an accessible name, keyboard-native semantics,
      visible focus, and at least a 24 CSS px target in the authored stylesheet.
- [x] Page metadata has self-consistent canonicals and page-specific social
      metadata; the duplicate `/orbz` route consolidates to `/`.
- [x] Preview deployments are non-indexable while production remains crawlable.
- [x] The site emits a restrictive CSP compatible with Next.js static rendering
      and Pagefind, plus HSTS, MIME sniffing, referrer, permissions, framing, and
      cross-origin hardening headers.
- [x] CI uses frozen dependencies and immutable action references; automated
      dependency updates are configured.
- [x] React/Next Biome domains are explicit and security/a11y recommended rules
      remain active.
- [ ] Full pinned-toolchain gate (`pnpm check` and registry advisory audit) passes in CI; local source-contract gates pass.

## Failure Behavior

- An invalid canonical site URL fails configuration early instead of generating
  malformed metadata.
- A preview deployment responds with crawler directives that prevent indexing.
- If a future Pagefind or Next.js runtime requires a new CSP source, CI/build
  validation must fail before the policy is relaxed; the policy is not weakened
  pre-emptively.
- If the package dependency ceases to be an exact version, the security audit
  fails until the release policy and version badge contract are deliberately
  updated.

## Out of Scope

- Redesigning Nextra navigation, footer, content cards, colors, spacing, or
  typography.
- Changing OrbZ runtime implementation or public API.
- Claiming WCAG conformance from static automation alone.
- Claiming good production LCP/INP/CLS without representative p75 field data.
- Adding analytics, advertising, tracking, authentication, or new embeds.

## Verification Note

The implementation and committed source-contract gates are complete locally. The
current sandbox cannot resolve `registry.npmjs.org`, so Corepack cannot obtain the
pinned pnpm binary and the frozen install, Biome, full TypeScript check, production
build, and registry advisory audit cannot be executed here. SPEC-002 remains
`in-progress` until that pinned-toolchain CI evidence is green.

## Evidence and Promotion

Durable checks live under `.audits/`; framework/security tradeoffs are promoted
into ADR-0003 and existing rules. Temporary browser/Lighthouse/axe reports, if
produced after deployment, remain transient audit evidence and are not committed
unless they establish a durable architecture decision.
