---
id: SPEC-000
title: Orbz Docs standalone Nextra site baseline
type: baseline
status: implemented
mode: retrospective
created: 2026-08-23
updated: 2026-09-04
owners:
  - NeonGate AI
targets:
  - app
  - content
  - next.config.mjs
  - site.config.ts
  - package.json
context:
  - .agents/context/repository.md
  - .agents/context/content-architecture.md
  - .agents/context/web-quality.md
rules:
  - .agents/rules/001-architecture.rule.md
  - .agents/rules/004-content-contracts.rule.md
  - .agents/rules/009-react-and-next.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
skills:
  - .agents/skills/documentation-and-adrs/SKILL.md
  - .agents/skills/seo/SKILL.md
evidence:
  - git:ab6b5fe
  - app/layout.tsx
  - app/[[...mdxPath]]/page.tsx
  - content/_meta.ts
  - next.config.mjs
---

# SPEC-000: Orbz Docs standalone Nextra site baseline

## Retrospective notice

This spec records repository capability that already existed when the initial
Docs implementation was committed on 2026-08-23 (`ab6b5fe`). It does **not**
claim that the current spec-driven workflow governed that historical
implementation. The spec exists so future work has an explicit baseline instead
of reconstructing the product/documentation contract from source every time.

## Objective

Operate one canonical public documentation application for the published
`@neongate-ai/orbz` Web Component, with Nextra providing file-based MDX content,
document navigation and search UI on top of the Next.js App Router.

## Repository boundary

- `NeonGate-AI/docs` owns the public docs site, its authored content, navigation,
  metadata, search configuration and docs-only UI.
- `NeonGate-AI/orbz` owns Web Component implementation and package releases.
- `NeonGate-AI/orbz-sandbox` owns framework demonstration applications.
- Docs consume a published Orbz package version; they do not reach into product
  workspaces or private source paths.

## Application contract

1. Public documentation is authored in root `content/` as Markdown/MDX.
2. Co-located `_meta.ts` files define intentional Nextra navigation labels/order.
3. `app/[[...mdxPath]]/page.tsx` is the gateway from App Router paths to Nextra
   content and uses `generateStaticParamsFor` plus `importPage`.
4. The root layout uses Nextra Docs Theme and `getPageMap()` while keeping the
   document language explicit and browser-only behavior behind narrow Client
   Component boundaries.
5. Page metadata comes from the Nextra/Next metadata flow and every public route
   receives a self-referential canonical beneath the configured site URL.
6. `robots.ts` and `sitemap.ts` expose crawl directives for the canonical public
   site.
7. Search uses Nextra's Pagefind integration; the production build is indexed in
   `postbuild` and generated Pagefind assets are not durable source.
8. Live Orbz examples use the published custom element/package contract rather
   than a private React-only implementation.

## Web quality baseline

- Authored content and docs-specific UI target WCAG 2.2 Level AA.
- Technical SEO requires crawlable canonical pages with descriptive metadata and
  sitemap coverage.
- Performance work preserves server-first content and minimizes unnecessary
  client JavaScript.
- Production Core Web Vitals claims require representative field p75 evidence;
  source/lab inspection is diagnostic only.

## Acceptance criteria

- [x] The docs app is independently buildable/deployable as a Next.js/Nextra site.
- [x] The root `content/` directory is rendered through one Nextra catch-all route.
- [x] Navigation is derived from the content/page-map model rather than a second
      disconnected route registry.
- [x] The published `@neongate-ai/orbz` package is the runtime product dependency.
- [x] Pagefind runs after the production build and generated output is ignored.
- [x] Canonical, robots and sitemap source surfaces exist for public discovery.

## Failure behavior

A documentation route whose MDX module cannot be imported, whose internal link
target does not exist, or whose required metadata is absent is treated as a docs
quality failure. A missing runtime/field measurement remains “unverified”; it is
never converted into a synthetic pass/fail claim.

## Out of scope

- Orbz Web Component implementation internals.
- Framework sandbox application implementation.
- Production Search Console/CrUX/RUM configuration.
- Claims that every current page is editorially complete or ranking-optimized.
