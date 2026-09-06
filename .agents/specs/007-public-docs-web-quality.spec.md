---
id: SPEC-007
title: Accessible and secure public documentation quality
type: fix
status: in-progress
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - NeonGate AI
targets:
  - app/layout.tsx
  - app/globals.css
  - app/home-playground.css
  - app/[[...mdxPath]]/page.tsx
  - .audits/
  - package.json
  - pnpm-lock.yaml
  - pnpm-workspace.yaml
context:
  - .agents/context/repository.md
  - .agents/context/web-quality.md
  - .agents/context/orbz-public-contract.md
rules:
  - .agents/rules/002-code-style.rule.md
  - .agents/rules/006-accessibility.rule.md
  - .agents/rules/007-seo.rule.md
  - .agents/rules/008-performance-core-web-vitals.rule.md
  - .agents/rules/009-react-and-next.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
  - .agents/adrs/0003-static-compatible-content-security-policy.adr.md
skills:
  - .agents/skills/spec-driven-development/SKILL.md
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/web-quality-audit/SKILL.md
  - .agents/skills/accessibility/SKILL.md
  - .agents/skills/seo/SKILL.md
  - .agents/skills/core-web-vitals/SKILL.md
  - .agents/skills/best-practices/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - .audits/accessibility.audit.sh
  - .audits/performance.audit.sh
  - .audits/security.audit.sh
  - .audits/web-quality.audit.sh
---

# SPEC-007: Accessible and secure public documentation quality

## Problem Statement

The documentation already has crawl metadata, security headers and quality
audits, but the light theme's cyan focus ring and cyan/pink heading gradient
have insufficient contrast. Mobile visitors cannot reach search because the
desktop search is hidden and the built-in mobile search is disabled. Decorative
shell orbs animate indefinitely, and the homepage repeats its brand in the
document title. The current contrast audit repeats constants instead of reading
the CSS that users receive. The production advisory audit also identifies
GHSA-6gmq-8vp8-gcm6 in transitive `@xmldom/xmldom@0.9.10` through Nextra's
math-rendering dependency chain.

## Solution

Preserve the existing visual identity and static documentation architecture
while correcting contrast, restoring native mobile search, making decorative
shell motion static and keeping page metadata concise. Enforce the actual CSS
tokens and the deliberately small set of interactive client entry points. The
new homepage playground owns its own accessible motion control and synthetic
speech interaction through its companion feature spec.

## Scope

Authored theme/chrome, mobile documentation search, route metadata, the narrow
transitive dependency advisory fix and mechanical accessibility/security/
performance checks. Public-source privacy and homepage layout/playground are
separate coordinated specs.

## Decisions and Constraints

- The owner authorized specification and implementation of public-readiness,
  security, SEO and accessibility improvements on 2026-09-06.
- Use Nextra's existing Search in its built-in mobile navigation; do not add a
  custom search implementation or runtime dependency.
- Supply Search once through Layout. Nextra owns its desktop navbar and mobile
  menu placements; do not render an additional Search in Navbar children.
- Decorative header/footer orbs use the published `reduced-motion="always"`
  setting. The main demo follows the user's system preference and offers pause.
- Light-theme focus needs at least 3:1 against adjacent authored surfaces;
  normal text needs 4.5:1, and every heading-gradient stop needs 3:1.
- Preserve static MDX, Server Component root layout, canonical/robots/sitemap
  behavior, restrictive production CSP and denied microphone/camera permission.
- Approve only three client entry points: element registration, theme toggle
  and `app/home-playground.client.tsx`. Imported control helpers do not require
  additional client directives. No editor framework or provider SDK is added.
- Resolve `@xmldom/xmldom` to the patched `0.9.12` release through the smallest
  compatible lockfile change. `speech-rule-engine@4.1.4` pins the affected
  version exactly, so use only the scoped pnpm override
  `speech-rule-engine@4.1.4>@xmldom/xmldom: 0.9.12` in `pnpm-workspace.yaml`.
  Preserve direct dependency versions. This fix
  follows the registry advisory; it does not assert a demonstrated exploit
  against the documentation site.
- Source, build and browser evidence remain distinct from field CWV or full
  WCAG conformance evidence.

## Testing Decisions

### Primary seam

Rendered documentation in a production build: keyboard access to search and
demo controls at mobile/desktop widths, both themes, visible focus, readable
headings and static decorative shell. Root integration owns browser execution.

### Required validation

- Contrast audit reads CSS token declarations and the real focus/gradient
  references; confirms that the previous low-contrast tokens fail.
- Source audits enforce built-in mobile search, static decorative shell motion,
  the exact client-boundary allowlist and the existing security contract.
- Static checks and production build pass; generated metadata has one brand
  suffix with existing canonical/social/robots behavior intact.
- Browser checks cover mobile/desktop search, keyboard/focus, both themes,
  reduced motion and forced colors alongside playground verification.
- The production dependency advisory audit remains required in the full gate.

## Acceptance Criteria

- [x] Actual authored CSS passes text/focus/gradient contrast thresholds.
- [ ] Mobile and desktop visitors can use native documentation search, with only one desktop navbar search.
- [ ] Decorative shell orbs remain static in both system motion preferences.
- [ ] Homepage title and social title avoid repeated branding.
- [ ] Static rendering, canonical discovery and security headers remain intact.
- [x] New client boundaries fail unless explicitly admitted by this spec.
- [ ] The production dependency graph excludes the affected XML-parser version
  and the corresponding registry advisory no longer appears.
- [ ] Full repository gate and scoped browser verification pass.

## Failure Behavior

Unknown client boundaries, inaccessible CSS changes and disabled mobile search
fail the relevant audit. Unknown routes retain normal not-found behavior. The
docs do not request microphone access or provider credentials. Browser speech
availability/failure handling is owned by the playground spec. If runtime
verification is blocked, this spec remains in progress with that gap recorded.

## Out of Scope

Repository visibility changes, provider credentials, hosted voice sessions,
analytics, field measurement collection, search ranking guarantees and a claim
of complete WCAG conformance.

## Evidence and Promotion

Promote the actual-token contrast and deliberate client-boundary checks to the
existing audits. Record command and browser evidence here before completion.
Keep ADR-002/003 authoritative; this change does not alter their decisions.
Record the production advisory result and resolved lockfile version for
GHSA-6gmq-8vp8-gcm6 before closing the dependency criterion.

### Source evidence, 2026-09-06

- `sh .audits/accessibility.audit.sh` first rejected the previous cyan focus
  ring (1.39:1 against the light page) and cyan/pink heading stops (1.39:1 and
  2.67:1); it passes after reading the corrected actual CSS values.
- Temporary isolated fixture mutations confirmed that restoring the cyan
  light focus ring and disabling the mobile `Search` each fail the audit.
- The same audit reads the playground's code-string colors and input borders.
  Code strings contrast at 7.04:1 in light mode and 12.68:1 in dark mode.
  Color and speech inputs use contrast-safe visible boundaries; card borders
  remain decorative.
- `sh .audits/performance.audit.sh` accepts the approved entry points. An
  isolated `.ts` fixture with a leading comment and an unapproved `use client`
  directive is rejected by the TypeScript syntax-tree check.
- `sh .audits/security.audit.sh` passes with evaluated production and preview
  CSP/permissions/indexing headers; it does not infer deployed-header results.
- Shell syntax and scoped Biome checks pass. Existing unrelated CSS
  `!important` warnings remain unchanged.
- The lockfile and scoped override resolve `speech-rule-engine@4.1.4` to
  `@xmldom/xmldom@0.9.12`; the old `0.9.10` resolution is absent. The final
  installed-graph/advisory check is owned by integration validation.
- Full integration, advisory verification, generated metadata and browser
  evidence remain pending; this spec is not yet implemented.

## Integration evidence — 2026-09-06

The assembled implementation passed `pnpm check` with Node 24.19.0 and
pnpm 10.32.1: all source audits, 22 behavioral tests, formatting, lint,
TypeScript and the production build. Five pre-existing CSS style warnings
remain non-blocking. Pagefind indexed 19 documentation pages.
`pnpm audit --prod --json` reported zero known vulnerabilities after the
scoped XML-parser patch. This is registry advisory evidence at this date.

Generated HTML checks for `/` and `/orbz` confirmed a single main landmark and
headline, the visible code example, all five color inputs, the default native
orb size, safe npm link and shared canonical/title. The alias imports the
canonical authored page, so both routes render the same homepage.

The cloud browser rejected localhost with `ERR_BLOCKED_BY_CLIENT`. Visual,
keyboard, responsive/theme and real speech playback acceptance therefore remain
unverified; source/controller/build evidence does not replace them. No field
Core Web Vitals or complete WCAG conformance is claimed. CI and final reviewed
head are recorded in the delivery PR.

The independent source review found and resolved protected-filename logging and
dangling-symlink handling in the privacy audit. Both gained negative regression
coverage; the resulting suite passes all 24 behavioral tests.

## Owner preview regression — 2026-09-06

The owner identified two desktop search bars. Inspection of the installed Nextra
4.6.1 Navbar confirms it renders Layout's Search automatically; the manually
added Navbar child duplicates it. Remove that child and its unused CSS, retain
the single Layout search configuration for both native placements, and extend
the existing accessibility audit to reject duplicate authored Search instances.
This revision preserves mobile search instead of disabling it to hide the duplicate.

The strengthened audit first failed against the duplicated Search instances, then
passed after removing the manual Navbar child. Generated HTML on `/`, `/orbz` and
`/orbz/getting-started` contains exactly one search input inside the native desktop
navbar and one in Nextra's separate mobile menu. No custom search widget or new
runtime dependency was introduced. Browser search interaction remains pending.
