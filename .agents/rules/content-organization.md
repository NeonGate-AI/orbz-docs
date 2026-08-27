---
version: 1
name: Orbz Documentation Content Organization
description: Rules for Orbz documentation, links, sandboxes, and source references.
alwaysApply: true
priority: high
---

# Documentation Content Organization

- Keep the global landing page at `content/index.mdx`.
- Keep Orbz documentation under `content/orbz/` with its own `_meta.ts`.
- Prefer durable public URLs and published package APIs in examples.
- Code samples must compile conceptually against the documented public release;
  never import private source paths.
- Link framework demos to the `NeonGate-AI/orbz-sandbox` repository.
- Changelogs document published behavior and migration guidance, not internal
  implementation speculation.
- Preserve accurate repository provenance in edit links.
