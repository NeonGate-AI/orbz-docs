---
id: SPEC-006
title: Make the homepage a native voice component playground
type: feature
status: in-progress
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - NeonGate AI
targets:
  - homepage hero and documentation-only interactive preview
context:
  - .agents/context/repository.md
  - .agents/context/orbz-public-contract.md
  - .agents/context/web-quality.md
rules:
  - .agents/rules/004-content-contracts.rule.md
  - .agents/rules/006-accessibility.rule.md
  - .agents/rules/007-seo.rule.md
  - .agents/rules/008-performance-core-web-vitals.rule.md
  - .agents/rules/009-react-and-next.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
  - .agents/adrs/0003-static-compatible-content-security-policy.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/frontend-ui-engineering/SKILL.md
  - .agents/skills/accessibility/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - app/home-playground.client.tsx
  - app/home-playground.voice.ts
  - app/home-voice-example.tsx
  - scripts/test-playground.sh
  - tests/home-playground-voice.test.ts
---

# SPEC-006: Make the homepage a native voice component playground

## Problem Statement

The homepage presents a large decorative orb beside a vertically wrapped slogan.
Visitors cannot inspect a voice-model integration or try the component's public
appearance and speech APIs without leaving the page. The owner wants a more
useful layout while retaining the site's visual identity and introductory copy.

## Solution

Use “One Voice Component” across the full hero width, remove its eyebrow, and
present a read-only JavaScript integration example beside a smaller native orb.
Place the introduction and primary links after the complete playground, outside
the sticky preview's containing area. Below the example, provide five color
inputs, a size slider, visual state selection, animation pause/resume, and a
short text-to-speech form. The example explains application-owned Realtime
authorization; the interactive preview uses browser speech and says so clearly.

## Scope

The homepage hero, server-rendered code example, a bounded browser interaction
component, and their styles. The existing /orbz canonical alias renders the same
authored homepage module so its content cannot drift. The owner authorizes specification and implementation
for preview/review; publication and repository visibility are separate actions.

## Decisions and Constraints

- Preserve the current palette, gradients, type identity, description, links and
  lower homepage sections. The exact headline is “One Voice Component”, spanning
  both columns with fluid sizing and no wrapping above the 760px mobile breakpoint.
  Mobile may wrap naturally to avoid overflow.
- The editor and orb begin directly below the headline. Keep the existing desktop
  sticky preview and mobile stacking. The description and both primary links form
  a left-aligned block after all controls and outside the hero/playground section,
  so they appear below the bottom limit of the orb's sticky travel.
- Interpret the requested final orb size as two-thirds of its previous diameter:
  `clamp(10rem, 18.6667vw, 14.6667rem)` at the default 100% slider position.
- The npm link opens a new tab with `noopener noreferrer` and an accessible cue.
- The example is selectable, noneditable, rendered as text, and follows the
  existing light/dark theme without an embedded editor dependency.
- Use only the published Orbz 1.0.0 API. Do not implement a wrapper package or
  reach into the element's closed shadow root.
- Realtime model selection and `/api/voice/session` are illustrative consumer
  code. Docs does not implement/call that endpoint or access the microphone.
- Browser speech is opt-in, uses no site-owned provider key, and is not described
  as an AI conversation or guaranteed offline/local-only processing.
- Use native controls, labels, visible state/error text, reduced-motion system
  behavior, a pause control, and keyboard/forced-colors support.
- Keep the published adapter's failure events observable, cancel blocked-activation
  retries, and stop active speech/remove listeners on unmount.
- Reserve the preview frame and keep essential prose/code visible in server HTML.

## Testing Decisions

### Primary seam

The built homepage in a browser: layout, native component attributes, keyboard
controls, light/dark themes, text playback lifecycle, failure/stop behavior, and
absence of microphone or provider requests.

### Required validation

Run scoped Biome and TypeScript checks during implementation, then the repository
gate. Exercise the native-element speech controller with Node's built-in test
runner: silence before submit, errors, cancellation, late promises after manual
state changes, and cleanup. This seam uses controllable EventTarget/element ports
and does not claim browser synthesis or rendering evidence.
Inspect at desktop and narrow mobile widths in both themes. Use browser
speech stubs where the test environment lacks voices to verify deterministic
activation, error and cancellation behavior; distinguish those checks from
audible real-device playback. Verify the deployed/preview page before closing
browser acceptance. Runtime accessibility/lab checks support but do not establish
WCAG conformance or field Core Web Vitals.

## Acceptance Criteria

- [ ] “One Voice Component” spans the hero in one fluid line outside mobile; mobile can wrap.
- [ ] Editor and orb sit beside each other below the headline, with desktop sticky behavior retained.
- [ ] Description and both links follow every control, outside the sticky area; the eyebrow remains removed.
- [ ] Default orb diameter is two-thirds of the prior responsive size.
- [ ] Read-only JavaScript shows the published model/session API and is legible in both themes.
- [ ] Color, size and state controls update the native orb; pause/resume works.
- [ ] Nonblank submitted text speaks only on explicit activation, with a working Stop control.
- [ ] Unsupported/blocked/failed speech gives visible feedback and never queues an unrelated-click retry.
- [ ] No microphone/provider authorization is requested by the public preview; cleanup cancels speech.
- [ ] Mobile reflow, keyboard focus, status text and theme behavior pass browser review.
- [ ] Initial server HTML contains the headline, prose and example, with no hydration regressions.
- [ ] Repository quality gate and independent standards/spec reviews pass.

## Failure Behavior

Controls remain disabled before browser initialization. Without speech synthesis,
visual customization remains usable while the form explains its unavailability.
Empty/whitespace input is not spoken. Failed synthesis produces a retained,
accessible error; stopping cancels the active run and any activation retry.
Listeners are removed and speech stopped on unmount. A failed required gate
keeps this spec in progress; revert the bounded hero change if rollback is needed.

## Out of Scope

Live AI conversations, microphone input, server session authorization, credentials,
product package changes, a full editor, analytics, and redesign of lower sections.
The public preview does not establish real-device voice availability or provider
quality. Security/SEO harness improvements belong to their own specs.

## Evidence and Promotion

The published package README/declarations and public-contract snapshot informed
the API choice before implementation. Temporary validation output belongs in
`.audits/`; retain final results and reviewed head in the spec/PR. Promote only
verified contract clarifications, with no unsupported field-quality claims.

Lifecycle: owner-authorized behavior recorded as `ready` on 2026-09-06 before
implementation, then moved to `in-progress`. Browser and final-gate criteria
remain pending until executed.

Source/unit evidence on 2026-09-06: six native-controller tests failed before
implementation because the controller did not exist, then passed after the
implementation. They verify silence before explicit activation, nonblank text,
event-only activation failure and retry cancellation, late rejection after a
manual state change, retained error visibility, unsupported synthesis, and
disposal/listener cleanup. Scoped Biome checks and the repository TypeScript
check passed. The runtime bundle uses the pinned published Orbz dependency.

The integration example and primary copy are server-rendered. CSS uses existing
theme variables, reserves the live stage, places the preview between code and
controls on mobile, and keeps the preview beside scrolling desktop controls.
These are source-level assertions; visual, keyboard and actual playback checks
remain pending because the browser cannot currently access the local preview.

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

## Owner preview feedback — 2026-09-06

After inspecting the initial preview, the owner requested the shorter headline,
viewport-aware single-line desktop typography, and relocation of the description
and actions below the complete playground. This revision was recorded before
changing the layout. The owner specifically approved retaining the existing orb
following effect. This feedback is not blanket browser acceptance of the controls,
themes, keyboard behavior or the revised layout.

Revision evidence: `pnpm check` passed all audits, 24 behavioral tests, formatting,
lint, TypeScript and the production build; Pagefind indexed 19 pages. Generated
HTML for `/` and `/orbz` confirms the exact single h1 text, sibling editor/preview,
and description/actions after the closed hero and every control. The npm link
retains its new-tab protections. Fluid desktop sizing and mobile wrapping are
source-level evidence; the revised preview still needs visual acceptance. The
delivery PR records the exact reviewed commit and its CI/deployment results.
