---
id: SPEC-000
title: <bounded change title>
type: feature
status: draft
mode: prospective
created: YYYY-MM-DD
updated: YYYY-MM-DD
owners:
  - <owner>
targets:
  - <repository area>
context:
  - <relevant .agents/context file>
rules:
  - <relevant .agents/rules file>
adrs:
  - <accepted/proposed ADR or none>
skills:
  - .agents/skills/to-spec/SKILL.md
evidence:
  - pending
---

# SPEC-000: <bounded change title>

## Problem Statement

Describe the observable problem and affected user/developer task.

## Solution

Describe the required behavior and public boundary, not a file-by-file plan.

## Scope

State owned behavior and repository areas.

## Decisions and Constraints

List decisions that materially constrain implementation.

## Testing Decisions

### Primary seam

Name the highest observable seam that can verify the behavior.

### Required validation

List tests, audits, build checks, manual checks and field evidence where relevant.

## Acceptance Criteria

- [ ] Observable outcome.
- [ ] Failure behavior verified.
- [ ] Applicable accessibility/SEO/performance impact evaluated.
- [ ] Repository quality gate passes.

## Failure Behavior

Define invalid input, unavailable dependency, fallback and rollback behavior.

## Out of Scope

List adjacent work intentionally excluded.

## Evidence and Promotion

State where temporary evidence lives and which durable conclusions should be
promoted to context, rules, ADRs or tests.

## Retrospective Integrity

Include only for `mode: retrospective`: identify evidence and disclose what
original intent cannot be proven.
