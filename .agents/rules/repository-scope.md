---
version: 1
name: Neongate AI Docs Repository Scope
description: Canonical boundaries for the central Neongate documentation repository.
alwaysApply: true
priority: critical
---

# Repository Scope

- This repository owns technical documentation for Neongate AI products and
  engineering practices.
- Product documentation lives under `content/<product>/`.
- Orbz documentation lives under `content/orbz/`.
- Documentation must consume published packages. Never depend on a sibling
  workspace or unpublished local product source.
- Documentation explains public contracts; implementation repositories remain
  the source of truth for code.
- Keep deployable application code limited to the Nextra/Next.js docs site.
