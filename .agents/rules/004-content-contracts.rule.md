---
version: 1
name: Documentation Content Contracts
description: Accuracy, routing and navigation rules for public Orbz documentation.
alwaysApply: true
priority: high
tags: [docs, mdx, nextra]
---

# Documentation content contracts

- Public API statements must match a published/supported Orbz contract.
- Material public-contract documentation changes also update `.agents/context/orbz-public-contract.md` after source verification.
- Every indexable MDX page has a non-empty `title` and page-specific `description`.
- One concept has one canonical explanation; adjacent pages link instead of copying normative prose.
- New routes must be intentionally placed in `_meta.ts` navigation or documented as intentionally hidden.
- Internal links use canonical routes and descriptive anchor text.
- Examples must be complete enough to copy safely and must not expose secrets or imply unsupported behavior.
- Breaking documentation changes to public contract meaning require a spec even when no application source changes.
