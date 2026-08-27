---
version: 1
name: Orbz Docs Repository Scope
description: Canonical boundaries for the Orbz documentation repository.
alwaysApply: true
priority: critical
---

# Repository Scope

- This repository owns the public technical documentation for
  `@neongate-ai/orbz`.
- The global Orbz landing page lives at `content/index.mdx`.
- Orbz documentation lives under `content/orbz/`.
- Documentation must consume published packages. Never depend on a sibling
  workspace or unpublished local product source.
- Documentation explains public contracts; implementation repositories remain
  the source of truth for code.
- Keep deployable application code limited to the Orbz Nextra/Next.js docs site.
