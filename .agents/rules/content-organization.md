---
version: 1
name: Documentation Content Organization
description: Rules for product documentation, links, examples, and source references.
alwaysApply: true
priority: high
---

# Documentation Content Organization

- Keep the global landing page at `content/index.mdx`.
- Keep each product under `content/<product>/` with its own `_meta.ts`.
- Prefer durable public URLs and published package APIs in examples.
- Code samples must compile conceptually against the documented public release;
  never import private source paths.
- Link framework demos to the `NeonGate-AI/orbz-examples` repository.
- Changelogs document published behavior and migration guidance, not internal
  implementation speculation.
- Preserve accurate repository provenance in edit links.
