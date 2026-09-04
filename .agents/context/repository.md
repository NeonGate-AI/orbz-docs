# Repository Context

## Purpose

`NeonGate-AI/docs` publishes the public technical documentation for
`@neongate-ai/orbz`.

## Technology

- Next.js 16 App Router
- Nextra 4 and `nextra-theme-docs`
- MDX content under `content/`
- Pagefind search generated after production build
- React 19 and TypeScript
- Biome for formatting/linting
- pnpm on Node.js 24
- Vercel deployment

## Repository ownership

This repository owns:

- documentation information architecture and navigation;
- public explanations, examples and API documentation;
- documentation-only components and styling;
- page metadata, canonical URLs, robots and sitemap;
- search indexing configuration;
- documentation quality gates and harness.

It does not own:

- the `<orb-z>` implementation;
- package exports or runtime behavior of `@neongate-ai/orbz`;
- framework sandbox application logic.

When the docs and product disagree, verify the published package and product
repository. Do not silently redefine the product contract in documentation.

## Canonical application surfaces

- `app/layout.tsx`: global theme shell and root metadata.
- `app/[[...mdxPath]]/page.tsx`: Nextra content route and per-page metadata.
- `content/`: authored documentation.
- `content/**/_meta.ts`: navigation structure.
- `site.config.ts`: stable site URLs and product links.
- `app/robots.ts` and `app/sitemap.ts`: crawler discovery.
- `next.config.mjs`: Nextra integration and search behavior.

## Commands

`pnpm harness:check` validates harness/content contracts.
`pnpm check` is the full local merge gate.
`pnpm build` must continue to generate the Pagefind index through `postbuild`.
