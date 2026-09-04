---
version: 1
name: Security and Privacy
description: Documentation-site safety constraints.
alwaysApply: true
priority: high
tags: [security, privacy]
---

# Security and privacy

- Never commit credentials, tokens, customer data or private transcripts in docs/examples.
- Examples use synthetic placeholder values and clearly mark secrets as environment/configuration inputs.
- External scripts, embeds and analytics require explicit ownership and review for privacy, CSP and performance impact.
- Do not weaken framework security headers or link policies solely to make an embed work.
- Dependency changes are reviewed for necessity and production impact.
- Public documentation must not expose private repository internals, unpublished endpoints or security-sensitive operational details.
