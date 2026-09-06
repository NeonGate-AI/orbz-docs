# Orbz Docs Engineering Instructions

This repository owns the public documentation site for `@neongate-ai/orbz`.
It is a standalone Next.js 16 + Nextra 4 application. The product implementation
and framework sandboxes live in separate repositories.

## Read order

Before changing this repository, load only the context required by the task:

1. `.agents/context/repository.md`
2. `.agents/rules/readme.md` and every applicable `alwaysApply` rule
3. the active `.agents/specs/*.spec.md`
4. accepted ADRs referenced by the spec
5. for public API/content work, `.agents/context/orbz-public-contract.md`
6. the smallest relevant skill procedure

Use `.agents/context/readme.md` as the context map when the task spans more than
one concern.

## Product boundaries

- `NeonGate-AI/orbz` owns the Web Component implementation and package release.
- `NeonGate-AI/orbz-sandbox` owns framework-specific demonstration applications.
- `NeonGate-AI/docs` owns documentation content, navigation, metadata, search,
  deployment configuration, documentation-specific UI and quality assurance.
- Consume the published `@neongate-ai/orbz` package. Do not use `workspace:*`
  links to product repositories.
- Documentation must describe the published public contract. Never document
  private source details as if they were supported API.

## Delivery model

This repository uses spec-driven development. A bounded behavior change starts
with a numbered spec unless it is a purely mechanical correction with no public
or architectural effect. Follow `.agents/specs/workflow.md`.

The default flow is:

`context -> spec -> implementation -> evidence -> two-axis review -> merge`

For substantial work use `to-spec`, `implement`, `tdd` where a test seam exists,
and `code-review`. Use `grilling` to stress-test consequential decisions and
`grill-me` only for unresolved owner input. Harness edits use
`harness-maintenance` and `writing-for-agents`. Content-only changes still need applicable SEO, accessibility
and documentation checks.

## Quality contract

The site targets:

- WCAG 2.2 Level AA for authored documentation and documentation UI.
- Search-engine crawlability, canonical consistency, complete sitemap coverage,
  useful page titles/descriptions and semantic content structure.
- Core Web Vitals "Good" thresholds at p75 in field data: LCP <= 2.5 s,
  INP <= 200 ms and CLS <= 0.1. Static checks and lab tools are diagnostic;
  they are not substitutes for field evidence.
- Nextra 4 file conventions and App Router semantics.
- Progressive enhancement and minimal client-side JavaScript for content pages.

Do not claim WCAG conformance, Core Web Vitals pass status, ranking improvement
or indexing success without the corresponding evidence.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm harness:check
pnpm check
pnpm dev
```

Use `.agents/workflows/readme.md` for reusable task sequences. Optional Cursor
adapters under `.cursor/` use the same repository checks. Docs has no custom CLI.

`pnpm check` is the merge gate. `pnpm harness:check` validates durable repository
contracts without requiring a production server.

## Git discipline

Commits follow Conventional Commits. `feat` and `fix` carry the normal semantic
versioning signal; `BREAKING CHANGE:` or `!` marks a major change. Husky runs
`lint-staged` before commit and Commitlint on the commit message.

Never bypass hooks to make a failing change mergeable. Fix the failure or update
the governing spec/rule first.
