---
version: 1
name: Spec-Driven Development
description: Numbered-spec lifecycle and evidence requirements.
alwaysApply: true
priority: high
tags: [specs, delivery]
---

# Spec-driven development

- Consequential bounded changes start from a durable `SPEC-###` in `.agents/specs/`.
- A prospective spec moves `draft -> ready -> in-progress -> implemented`; implementation begins only after `ready`.
- The spec owns behavioral intent; issues, branches, chats and PRs point to it.
- Acceptance criteria change through an explicit spec revision before implementation follows the new behavior.
- Tests/audits target the highest useful public seam and collect reproducible evidence.
- Temporary output lives in `.audits/`; stable conclusions are promoted to the correct harness layer.
- Final review evaluates repository standards and spec fidelity independently on the same final head.
- Retrospective specs clearly identify evidence and do not pretend the current workflow existed historically.

- Implemented specs have checked acceptance, no pending evidence, valid local references and a matching catalog status.
- Docs changes normally use pull requests directly to `main`. An explicit owner
  request may target `staging`; record that target in the spec and retain the same
  required CI checks. A staging PR does not authorize promotion or merge.
