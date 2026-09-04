---
version: 2
name: React, Next.js and Nextra
description: Framework-specific constraints for the documentation application.
alwaysApply: true
priority: high
tags: [react, nextjs, nextra]
---

# React, Next.js and Nextra

- Nextra 4 uses the Next.js App Router; do not introduce Pages Router conventions.
- Preserve `generateStaticParamsFor`/`importPage` for the `content/` catch-all route unless architecture changes explicitly.
- Use Next.js Metadata APIs for route metadata and canonical handling.
- Prefer Nextra Docs Theme built-ins and `nextra/components` before custom equivalents.
- Keep root layout client boundaries narrow; do not convert `app/layout.tsx` into a Client Component.
- Client components must not hide essential documentation content from initial server rendering.
- Keep Pagefind post-build indexing compatible with the generated Next.js output.
- Enable the Biome React and Next domains explicitly so framework-specific correctness rules are part of the default lint gate.
- Avoid hydration-only state/effects when CSS and server-stable markup can express the same visual behavior.
- Known documentation routes set `dynamicParams = false` so unknown paths do not become accidental runtime rendering work.
