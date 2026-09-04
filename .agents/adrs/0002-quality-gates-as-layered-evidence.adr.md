---
id: ADR-002
title: Treat web quality gates as layered evidence
status: accepted
date: 2026-09-04
owners: [NeonGate AI]
supersedes: none
---

# ADR-002: Treat web quality gates as layered evidence

## Context

SEO, accessibility and performance checks operate at different evidence levels.
Static source checks can detect metadata drift, while WCAG conformance and field
Core Web Vitals require runtime/human/production evidence. Conflating them leads
to false confidence and misleading claims.

## Decision

Use layered evidence:

1. deterministic harness/source checks in `.audits/`;
2. build/type/lint checks in the default merge gate;
3. lab/browser audits when configured for a change or release;
4. production field metrics and manual assistive-technology checks for claims
   that require them.

Each review states the evidence class used. Static or lab evidence must not be
reported as field CWV or WCAG conformance.

## Consequences

Quality work remains actionable in CI while preserving accurate claims about
what has actually been measured.
