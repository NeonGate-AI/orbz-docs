# Orbz Public Contract Snapshot

This is a navigation aid for agents working on the documentation. It summarizes
the published `@neongate-ai/orbz@1.0.2`
contract. It is not an independent source of product truth.

When changing public API documentation, verify the published package and the
canonical product repository first. Then update this snapshot when the durable
contract materially changes.

## Native element

The public UI primitive is the native `<orb-z>` custom element. Every framework
recipe renders the same tag rather than a framework-specific Orbz component.
Internal closed-Shadow-DOM nodes and CSS variables are not documented extension
points.

The published 1.0.2 manifest declares no third-party runtime dependencies. This
describes the component runtime; its development tooling and the Docs site have
their own dependencies.

### Visual state

`state` accepts five documented values:

- `idle`
- `listening`
- `thinking`
- `speaking`
- `asleep`

Unsupported state input normalizes to `idle`. State animation is presentation;
domain meaning must also be available outside motion/color where users need it.

### Size, motion and elevation

- `size`: CSS length in markup; the JavaScript property also accepts a positive
  number interpreted as pixels. Default: `16rem`.
- `speed`: positive multiplier. Default: `1`.
- `paused`: boolean attribute/property. Presence means true.
- `elevated`: boolean attribute/property. Presence means true.
- `reduced-motion` / `reducedMotion`: `system`, `always`, or `never`. Default:
  `system`.

`paused` and reduced motion have different semantics: pause freezes the active
presentation; reduced motion selects a calmer presentation policy.

### Appearance

The public appearance selector is `preset`, not `palette`.

The default appearance is branded NeonGate, independent of the GitHub owner
`gojhonny`. Version 1.0.2 restores its canonical API name after the accidental
rename in 1.0.1, without changing its colors.

| Contract | Value |
| --- | --- |
| Default preset | `neongate` |
| Deprecated input alias | `gojhonny`, normalized to `neongate` |

The installed `ORBZ_PRESET_NAMES` lists six canonical values:

- `neongate`
- `periwinkle`
- `magenta`
- `peach`
- `mocha`
- `ivory`

`DEFAULT_ORBZ_PRESET` and the default preset getter return the canonical default.
`OrbzPresetName` and `isOrbzPresetName()` retain the deprecated alias as accepted
input. The element reflects its normalized canonical name in the attribute and
getter. `ORBZ_PRESETS.gojhonny` is a non-enumerable, immutable reference to
`ORBZ_PRESETS.neongate`; it does not add a seventh enumerated palette.

Default examples may omit `preset` in HTML and use `DEFAULT_ORBZ_PRESET` /
`ORBZ_PRESETS[DEFAULT_ORBZ_PRESET]` in typed code. The canonical user-facing
explanation is the NeonGate preset name section in
`content/orbz/concepts/appearance.mdx`.

Custom appearance uses five native color attributes:

- `color-primary`
- `color-secondary`
- `color-accent`
- `color-highlight`
- `color-background`

Preset mode and custom-color mode are mutually exclusive. If both are supplied,
the documented behavior is that the preset wins. Do not introduce a `palette`
attribute/property into examples unless the product contract changes first.

## Voice and talk runtime

Structured voice/talk configuration uses JavaScript properties rather than HTML
string attributes. The documented properties include `speech`, `voiceEngine`,
`talkFlow`, read-only `talkContext`, and optional `intelligence`.

Talking is explicit: connecting the element does not start speech. Hosts provide
the desired speech or talk flow, configure a voice engine, and call
`startTalking()` after the visitor opts in. Orbz `1.0.0` ships without a canned
greeting, persona, or default conversation flow.

`WebSpeechAdapter` defaults to Brazilian Portuguese (`pt-BR`). Applications can
override the adapter language, including `en-US`, when another locale is
required. Browser or external speech integrations must preserve user activation
and privacy/security requirements. OpenAI credentials belong behind an
implementer-owned secure endpoint, never in browser-delivered docs examples.

## Voice models and Realtime conversations

Version 1.0.0 adds `voiceModel` for `web-speech`, `openai-speech`, and
`openai-realtime`. Assignment is silent; an explicit `voiceEngine` takes
precedence. `realtimeSession` is an application-owned endpoint object or async
SDP authorizer, supplied through JavaScript, never an HTML attribute.
Endpoint objects accept only `endpoint`, Fetch `credentials` policy and an
optional `fetch` implementation; unknown fields are rejected. Provider keys
remain on the backend. Browser memory is not a secure store for permanent keys.

`startConversation()`, `stopConversation()`, `interruptConversation()` and
read-only `conversationState` support direct Realtime WebRTC audio after explicit
activation. `orbz-conversation-state-change`, `orbz-transcript`,
`orbz-speaking-change` and `orbz-talk-error` expose state, text and errors to the
host. Documentation rendering does not exercise microphones or paid providers.

## Homepage voice example

The code sample uses the published `openai-speech` voiceModel with an
application-owned endpoint, `gpt-4o-mini-tts` and `marin`, followed by explicit
`startTalking()`. The displayed model/voice badges identify these example settings.
The interactive preview still selects browser Web Speech and discloses that fact.

## Configuration

`orbzConfiguration` is read-only. `transformOrbzConfiguration()` validates,
clones, fills omitted internal appearance/motion/speech groups and freezes a
complete configuration without changing the package singleton. Version 1.0.1
supports compact authored configuration; explicit internal overrides remain
supported. Version 1.0.2 also normalizes legacy compact and complete configuration
objects that used the accidental `gojhonny` name, preserving supplied colors and
the caller's input before freezing the result. Fork maintainers edit
`src/orbz.config.json` and rebuild;
the installed package does not fetch or discover a host configuration file.
Public configuration never contains credentials.

## Existing talk and presentation methods

The current element reference documents:

- `pause()`
- `play()`
- `restart()`
- `startTalking()`
- `receive(input)`
- `stopTalking()`

## Orb CLI

The published package exposes the POSIX shell binary `orb`. The canonical
transient installer is:

```bash
npx -y --package=@neongate-ai/orbz@latest orb
```

Project setup detects npm, pnpm, Yarn, or Bun from project metadata and
lockfiles, installs the executing Orbz version into an existing JavaScript
project, and does not generate or overwrite application source files.

In the Orbz source checkout, `orb cleanup` (alias `orb clean`) removes untracked
root/nested dependencies and generated output by default. `--dry-run` previews
targets and `--keep-dependencies` retains dependencies. Tracked content and nested
repositories are preserved. This is a source-maintenance command, not a cleanup
command for arbitrary consumer projects.

## Package entry points

The docs distinguish these entry points:

- `@neongate-ai/orbz`: pure root API; importing it does not register the tag.
- `@neongate-ai/orbz/browser`: root API plus guarded `defineOrbz()` side effect.
- `@neongate-ai/orbz/react-types`: optional JSX type augmentation; no React
  runtime component.
- `@neongate-ai/orbz/standalone`: self-contained browser bundle that registers
  the element.
- `@neongate-ai/orbz/index.css`: published source stylesheet used by the element.

`defineOrbz()` is documented as the normal explicit, idempotent, SSR-safe
registration helper.

## Canonical documentation sources

For details, start at:

- `content/orbz/api/index.mdx` for the element API.
- `content/orbz/api/exports.mdx` for package exports and entry points.
- `content/orbz/concepts/appearance.mdx` for preset/custom-color semantics.
- `content/orbz/concepts/states.mdx` for state meaning.
- `content/orbz/concepts/motion-accessibility.mdx` for motion/A11y semantics.
- `content/orbz/guides/voice-assistant.mdx` for talk/speech integration.
