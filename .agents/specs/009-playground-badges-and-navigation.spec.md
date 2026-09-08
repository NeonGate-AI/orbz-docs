---
id: SPEC-009
title: Playground badges and responsive GitHub navigation
type: enhancement
status: implemented
mode: prospective
created: 2026-09-07
updated: 2026-09-07
owners:
  - NeonGate AI
targets:
  - homepage playground and global navigation
context:
  - .agents/context/repository.md
  - .agents/context/orbz-public-contract.md
rules:
  - .agents/rules/006-accessibility.rule.md
  - .agents/rules/009-react-and-next.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
adrs:
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
skills:
  - .agents/skills/harness-maintenance/SKILL.md
  - .agents/skills/writing-for-agents/SKILL.md
evidence:
  - app/github-star.tsx
  - app/home-playground.data.ts
  - app/home-playground.client.tsx
  - app/home-playground.controls.tsx
  - app/home-playground.css
  - app/globals.css
  - app/layout.tsx
  - .agents/context/repository.md
---

# SPEC-009: Playground badges and responsive GitHub navigation

## Problem Statement

The owner's uploaded homepage contains placeholders for live status and voice
badges. Navigation needs a persistent package-repository star link on mobile.

## Solution

Show a green decorative dot beside Live component above the orb. Put model and
voice values in compact badges below it, explicitly identified as OpenAI example
settings because the interactive preview uses browser speech. Keep an accessible
speech input label. Match the code example to the displayed TTS settings.

Show a GitHub icon and Star on GitHub link on the right at all widths, targeting
`https://github.com/gojhonny/orbz`. On mobile, search and theme controls live in
the Nextra drawer. Desktop retains search and theme controls in the header.

## Scope

Use uploaded checkout dc30fbd and preserve all owner edits, including the compact
README, banner, spacing and removal of the framework section. Update the harness
and navigation checks. Source and local branch history are returned in a ZIP.

## Decisions and Constraints

- Owner authorized specification and implementation in this request.
- Latest placement instruction (star on the right everywhere) takes precedence.
- Use Nextra navigation/search primitives and the existing theme toggle.
- No remote Git operations, deployment, provider requests or dependency upgrades.
- Preserve published Orbz 1.0.0 consumption; local package source is not linked.
- Keep one page main landmark, keyboard controls, focus visibility, forced-colors
  and reduced-motion support. Search results remain usable in the mobile drawer.

## Testing Decisions

### Primary seam

Built page markup and responsive CSS at the Nextra 768px breakpoint; existing
voice controller tests protect activation, errors and cancellation. Browser
verification is attempted and any environment limitation is recorded explicitly.

### Required validation

Run `pnpm check`; verify star destination/placement, mobile drawer search/theme,
live indicator and badge markup. Review keyboard semantics and responsive sizing
in source. Browser-only checks remain disclosed when local preview access fails.

## Acceptance Criteria

- [x] Star link is visible on the right on desktop/mobile and targets the package.
- [x] Mobile search/theme are accessible in the drawer and absent from its header.
- [x] Green live dot appears above the orb; model/voice values are badged below.
- [x] Speech label, browser-preview disclosure and TTS example remain accurate.
- [x] Uploaded edits and compact README are preserved; harness is current.
- [x] Repository gate and generated-markup checks pass; browser limitation is recorded.

## Failure Behavior

Without browser speech, appearance controls and readable feedback remain usable.
GitHub is an ordinary external link; no count service is needed. Native Nextra
search retains its loading/error feedback and keyboard behavior.

## Out of Scope

Paid speech backend, package release, remote commits, PRs, deployment and field
CWV or full WCAG conformance claims.

## Evidence and Promotion

Validation on 2026-09-07 using Node 24.19.0 and pnpm 10.32.1:

- `pnpm check` passed: all harness audits, 24 tests, formatting, lint, TypeScript,
  production build and Pagefind indexing of 19 pages.
- Generated HTML for `/`, `/orbz` and `/orbz/getting-started` contains one main,
  the protected package star link and Nextra drawer search/theme controls.
- Both homepage routes place the live caption before the orb, then model/voice
  badges with the requested values, disclosure and a properly labelled input.
- Source review confirms the star is outside mobile-hidden wrappers; custom
  header theme/Docs controls hide below 768px while Nextra owns drawer controls.
  The version badge hides below 400px to leave room for the star and menu.
- README, authored homepage content and banner match the supplied ZIP byte for
  byte. Existing five CSS lint warnings are unchanged.
- Standards and spec-fidelity source reviews found no blocking issues. Root
  layout remains a Server Component and no client boundary/dependency was added.
- Browser verification was attempted but this environment rejected the local
  preview URL with `net::ERR_BLOCKED_BY_CLIENT`. Actual rendered mobile sizing,
  keyboard interaction, theme switching and drawer search interactions remain
  manual acceptance items; static/DOM checks are not claimed as browser evidence.

Durable navigation and voice-example ownership is recorded in repository context.
The existing single-Search audit remains applicable unchanged. No remote Git,
CI, deployment or provider operation was performed.
