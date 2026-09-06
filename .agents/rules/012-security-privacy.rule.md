---
version: 2
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
- Production responses use the accepted CSP/security-header baseline in ADR-003; new origins fail closed until explicitly reviewed.
- CI and deployments install from the frozen lockfile, and GitHub Actions are pinned to immutable commit SHAs with non-persistent checkout credentials.
- Runtime/tool dependencies use exact versions in this repository; automated dependency updates and registry advisory checks provide maintenance evidence.
- Known-vulnerable framework versions are merge blockers; Next.js and React stay on security-supported patch releases.
- Browser permissions remain denied unless a documented live feature requires them; adding microphone/camera/geolocation access requires threat-model review.

- Public-readiness review includes editor configuration, new candidate files and available Git history, not only application pages.
- A protected-term scanner is a regression tripwire; binary assets and historical visibility require separate review.
