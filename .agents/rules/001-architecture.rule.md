---
version: 1
name: Repository Architecture
description: Ownership and application architecture for the standalone Orbz Docs site.
alwaysApply: true
priority: high
tags: [architecture, nextra, ownership]
---

# Repository architecture

- This repository is one standalone Next.js/Nextra application, not a monorepo.
- `content/` owns authored public documentation; `app/` owns the Next.js shell and routes.
- Product implementation stays in `NeonGate-AI/orbz`; framework demos stay in `NeonGate-AI/orbz-sandbox`.
- Consume the published `@neongate-ai/orbz` package and never couple this repo with `workspace:*` product links.
- Keep the Nextra `content`-directory catch-all routing model unless an approved spec and ADR replace it.
- Durable engineering context belongs under `.agents/`; executable audit checks belong under `.audits/`.
- Generated outputs such as `.next/` and `public/_pagefind/` are not durable source.
