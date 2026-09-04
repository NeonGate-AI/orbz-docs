---
id: ADR-001
title: Keep Orbz documentation as a standalone Nextra application
status: accepted
date: 2026-08-23
owners: [NeonGate AI]
supersedes: none
---

# ADR-001: Keep Orbz documentation as a standalone Nextra application

## Context

This is a retrospective ADR for an architectural boundary already present in the initial documentation implementation committed on 2026-08-23. It records the decision; it does not claim the ADR historically preceded the code.

Orbz implementation, framework sandboxes and public documentation have different
release and deployment concerns. The documentation repository already operates
as a standalone Next.js/Nextra site and consumes the published Orbz package.

## Decision

Keep `NeonGate-AI/docs` as a standalone Next.js 16 + Nextra 4 application using
the Nextra `content/` directory convention and one App Router catch-all content
route. Product source and sandbox applications remain separate repositories.

Documentation may import the published package for live examples and typing, but
must not depend on product workspaces or private product source paths.

## Consequences

- Docs can deploy independently on Vercel.
- Documentation reflects released public API rather than unpublished workspace state.
- SEO, accessibility, search and docs UI can evolve without coupling product builds.
- Cross-repository contract changes require explicit coordination/evidence.

## Alternatives rejected

- **Monorepo/workspace coupling:** rejected because it makes docs deployment depend
  on unrelated product build topology and can document unreleased implementation.
- **Duplicate framework docs applications:** rejected because one canonical docs
  surface should own public explanation and search indexing.
