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

Center “One Voice Web Component” across the full hero width, with the description
and primary links centered below it. Present a compact read-only JavaScript
integration example beside a smaller native orb. Below the example, provide
visual states, followed by five color inputs and a size slider. Place the speech
form and animation pause/resume below the orb. The example explains application-owned Realtime
authorization; the interactive preview uses browser speech and says so clearly.

## Scope

The homepage hero, server-rendered code example, a bounded browser interaction
component, and their styles. The existing /orbz canonical alias renders the same
authored homepage module so its content cannot drift. The owner authorizes specification and implementation
for preview/review; publication and repository visibility are separate actions.

## Decisions and Constraints

- Preserve the current palette, gradients, type identity, description, links and
  lower homepage sections. The exact headline is “One Voice Web Component”, centered
  across both columns with the gradient on “Web Component”. Use fluid sizing and
  no wrapping above the 760px mobile breakpoint; mobile may wrap to avoid overflow.
- Center the description below the headline and both primary links below the
  description. The editor and orb follow this introductory block side by side.
- Reduce the homepage's top padding by one-third so the whole introduction moves
  toward the navbar. Use a smaller Get started action and a plain npm text link.
- Compact the editor to approximately 60% of its previous desktop height through
  fewer blank lines and reduced type spacing/padding, without clipping the example
  or making it unreasonably small. It remains secondary to interactive controls.
- Place visual states first below the editor, then colors and size. Put the text
  input, Speak, Stop and the existing motion pause/resume control below the orb.
  Pause continues to control animation; it does not claim to pause speech.
- Keep native orb behavior and sticky positioning within the available space;
  short viewports use normal flow so the newly colocated controls stay reachable.
  Mobile stacks editor, orb with speech/motion controls, then states/colors/size,
  with the same DOM and keyboard order. Avoid rearranging focusable controls with CSS.
- Compact the right preview frame so it fits common desktop viewports and can
  travel within the taller controls section. A taller preview must not inflate
  the editor row; keep only the normal gap before appearance controls.
- Remove the idle browser-voice availability sentence, retaining the live region
  and all speaking/error/unsupported feedback. No blank idle status space remains.
- Move the tagline/proof copy outside the right preview to a full-width footer
  below the playground. Use “Your text input to Voice”, with the three proof items
  in a baseline-aligned wrapping row beneath it. The first item reads
  “Native custom element, no third-party libs”, referring to the component runtime.
- Disable Nextra's page-copy toolbar on the homepage and its canonical alias only.
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

- [ ] Centered “One Voice Web Component” uses a gradient on “Web Component”, stays on one desktop line and can wrap on mobile.
- [ ] Description and action buttons are centered in consecutive rows under the headline.
- [ ] The complete, readable editor occupies approximately 60% of its previous desktop height and sits beside the orb.
- [ ] States precede colors/size; speech and motion controls sit below the orb with logical mobile focus order.
- [ ] The page-copy toolbar is absent from `/` and `/orbz` and retained on documentation pages.
- [ ] The introduction is closer to the navbar, actions are compact, and npm is a plain text link.
- [ ] The compact desktop preview can scroll within its section without expanding the editor/control gap.
- [ ] Idle speech helper copy is absent; status/error feedback and the full-width tagline/proof footer remain accessible.
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

## Second owner preview revision — 2026-09-06

The owner superseded the first revision's below-playground introduction with a
centered title/description/actions stack. They requested “One Voice Web Component”,
the gradient on its last two words, a roughly 60%-height editor, speech/motion
controls under the orb, and states before colors/size. The homepage page-copy row
is removed through Nextra's route configuration. The duplicate search regression
is tracked by SPEC-007. This contract was revised before implementation; visual
acceptance of the new arrangement remains pending.

Revision source/build evidence: the example now has 10 displayed lines instead
of 15, with reduced line spacing and padding targeting roughly 60% of its former
desktop height. Generated HTML for `/` and `/orbz` verifies the exact headline and
gradient span, description/actions before the playground, speech/motion controls
inside the orb preview, and states before colors/size. It also confirms the absent
page-copy toolbar on both home routes while `/orbz/getting-started` retains it.
The native speech controller and its six behavioral tests are unchanged. Source
review covers centered CSS, matching mobile DOM/focus order and normal flow on
short viewports. Exact visual proportions, rendered themes and browser interaction
remain pending; final command results and reviewed head belong to the delivery PR.

## Third owner preview revision — 2026-09-06

The owner requested a denser introduction and sticky preview, removal of the idle
speech sentence, a normal editor/control gap, and relocation/rewriting of the
tagline and inline proof items beneath the complete playground. The above contract
was amended before implementation. The installed Orbz 1.0.0 manifest declares no
runtime dependencies, supporting the component-specific proof copy. This remains
a revision to the active homepage spec, not a new product feature. The delivery
PR will record final source/build/CI evidence; visual acceptance remains pending.
