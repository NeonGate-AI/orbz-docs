---
version: 1
name: Source Organization
description: Canonical locations for application, content and harness files.
alwaysApply: true
priority: high
tags: [organization, ownership]
---

# Source organization

- `app/`: Next.js routes, layouts and documentation-only UI.
- `content/`: public MD/MDX documentation and co-located `_meta.ts` navigation.
- `public/`: intentionally public static assets and generated Pagefind output (generated output is ignored).
- `.agents/`: durable engineering harness.
- `.audits/`: reproducible audit entrypoints plus ignored transient reports.
- `.github/`: CI and collaboration templates.
- Do not create generic `utils/`, `common/` or `shared/` directories without an owning abstraction.
- Keep product implementation code out of this repository.
