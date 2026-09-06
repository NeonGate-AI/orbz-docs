---
id: SPEC-008
title: Compact homepage spacing and simplify component proof
type: enhancement
status: implemented
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - NeonGate AI
targets:
  - homepage hero, playground columns and component proof
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
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - content/index.mdx
  - app/globals.css
  - app/home-playground.client.tsx
  - app/home-playground.controls.tsx
  - app/home-playground.css
---

# SPEC-008: Compact homepage spacing and simplify component proof

## Problem Statement

The hero starts too far below the navbar, the shared grid stretches the gap
between the editor and appearance controls, and the orb panel contains extra
copy that makes it harder to fit in the viewport while following scroll.

## Solution

Tighten the existing homepage, preserve the sticky orb, and put a short proof
section beneath the complete playground instead of the three-card introduction.

## Scope

The homepage and its shared /orbz alias. The owner approved specification and
implementation in the existing preview branch on 2026-09-06. This supersedes
SPEC-006's mobile control order and preservation of the first lower section.

## Decisions and Constraints

- Reduce the homepage top padding by one third, retaining two thirds of each
  existing fluid bound. Keep the centered headline, gradient and description.
- Tighten description/action spacing; reduce the primary action's height,
  horizontal padding and text slightly. Keep at least a 24px target.
- Render View on npm as an ordinary text link with no button surface/border,
  retaining its destination, visible focus and protected new-tab behavior.
- Group the editor and appearance controls into one independently sized left
  column, with a fixed 1rem gap. DOM and mobile focus order follow editor,
  appearance controls, orb and speech controls, without CSS focus reordering.
- Reduce the right stage's minimum height from 20rem to 16rem and its sticky
  offset from 7rem to 5rem. Preserve the orb diameter and size slider range.
  Cap the panel at viewport height minus 6rem with overflow available; short
  viewports below 38rem and mobile fall back to normal flow.
- Remove the idle browser-voices disclaimer and its reserved blank height.
  Keep Browser voice preview, live status, unsupported and failure feedback.
- Move the tagline/proof outside the sticky panel into the section directly
  below the playground, replacing the three-card introduction. Use the exact
  heading Your text input to Voice. Align all three bullets on a shared desktop
  baseline below it, with natural wrapping on narrow screens.
- Use Native custom element, no third-party libs; retain Closed Shadow DOM and
  SSR-safe entry points. This claim concerns Orbz, not the docs application's
  Next.js/Nextra dependencies. Published Orbz 1.0.0 metadata verifies its scope.
- Keep remaining homepage sections, package APIs and speech behavior intact.

## Testing Decisions

### Primary seam

The built homepage HTML and the authored responsive CSS, supplemented by the
existing controller tests. Visual acceptance remains with the owner preview;
source/build evidence is not a claim of browser or assistive-technology testing.

### Required validation

Run pnpm check, inspect generated homepage and alias content/order, and review
standards and spec fidelity. No new tests duplicating CSS constants are needed.
Verify the preview deployment outcome on the resulting commit.

## Acceptance Criteria

- [x] Reduced hero/action spacing and a borderless npm link are implemented.
- [x] Editor/configuration spacing is independent of the preview column height.
- [x] Compact sticky preview retains speech, motion and appearance controls.
- [x] Idle disclaimer and its reserved height are removed; error/status feedback remains.
- [x] The three-card section is replaced by the exact new heading and baseline bullets.
- [x] Narrow layouts wrap normally and preserve DOM/focus order in source.
- [x] Repository gate, generated HTML checks and both source review axes pass.

## Failure Behavior

Unsupported synthesis and playback errors still produce accessible visible
feedback. Empty idle output stays mounted for announcements but reserves no
space. Normal flow handles short/mobile viewports and an enlarged orb.

## Out of Scope

Product releases, dependencies, voice-engine changes, production merge and
field CWV/WCAG claims. Existing SPEC-006/007 visual acceptance is not closed here.

## Evidence and Promotion

Record command outcomes and limitations here, and deployment/reviewed commit
in PR #7. Update the spec catalog only; no new durable architecture rule is needed.
Lifecycle: owner-authorized contract recorded ready before source edits.

Integration: while this change was being validated, commit 5750ea7 independently
delivered the spacing/copy revision under SPEC-006. Preserve its CSS values,
viewport overflow fallback and public-contract clarification. SPEC-008 completes
the independent editor column and replaces the lower three-card section; its
explicit decisions govern the resulting mobile order and proof placement.

Validation on 2026-09-06: pnpm check passed using Node 24.19.0 and pnpm
10.32.1, including all audits, 24 behavioral tests, formatting, lint, TypeScript,
production build and Pagefind (19 pages). Five existing CSS warnings remain
non-blocking. Generated HTML for / and /orbz verifies one headline, grouped
editor/appearance controls before the preview, the empty idle live region,
exact proof text, removal of the cards, five color inputs and the protected npm
text link. Independent Standards and Spec-fidelity source reviews passed with
no blocking findings after integrating 5750ea7. Actual rendered sticky travel,
responsive/theme appearance, nested scrolling and keyboard behavior were not
verified; the owner preview remains the visual acceptance surface.
