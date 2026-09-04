---
version: 1
name: Code Style
description: TypeScript, React and configuration conventions for Orbz Docs.
alwaysApply: true
priority: high
tags: [typescript, react, biome]
---

# Code style

- TypeScript is strict; avoid `any` when a local type can express the contract.
- Prefer Server Components. Add `'use client'` only for browser state/effects/interactions.
- Keep imports explicit and let Biome enforce formatting/lint rules.
- Use semantic HTML before ARIA and framework abstractions.
- Avoid introducing dependencies for behavior available from Next.js, Nextra or the web platform.
- Configuration files must match this repository's ESM package mode.
- Run `pnpm check` before merge.
