---
id: SPEC-004
title: Prepare the repository's public information boundary
type: governance
status: implemented
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - NeonGate AI
targets:
  - repository text and editor configuration
  - contributor README and public-boundary regression audit
context:
  - .agents/context/repository.md
rules:
  - .agents/rules/001-architecture.rule.md
  - .agents/rules/003-context-engineering.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0001-standalone-nextra-docs-site.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - .audits/public-boundary.audit.sh
  - scripts/harness.test.ts
  - README.md
  - .vscode/settings.json
  - https://github.com/NeonGate-AI/docs/actions/runs/34016935765
  - https://github.com/NeonGate-AI/docs/pull/7
---

# SPEC-004: Prepare the repository's public information boundary

## Problem Statement

The site is publicly served, but its source repository includes copied editor
configuration and stale contributor guidance. Publishing the repository must not
expose another application's private business vocabulary or implementation.

## Solution

Keep repository guidance specific to the public Orbz documentation contract.
Remove unrelated editor associations, refresh contributor instructions from the
actual manifest and deployment configuration, and add a repository-wide tripwire
for known protected identifiers without reproducing those identifiers in logs.

## Scope

Review tracked source, public content, assets, engineering guidance, editor and
CI configuration. Use synthetic negative fixtures to exercise hidden-file and
candidate-file coverage. The owner authorized this bounded implementation.

## Decisions and Constraints

The public artifact contains only documentation-owned context and supported
product API. Engineering procedures can be shared; private application records
cannot. Preserve historical specs as historical evidence. Removing current files
does not remove Git history. This delivery makes no repository visibility change,
history rewrite or main merge.

## Testing Decisions

### Primary seam

The public-boundary audit passes the cleaned working tree and rejects a synthetic
protected term added in an editor file or untracked candidate source file. It
reports paths and categories without printing matched content.

### Required validation

Run shell regression fixtures, repository audits and the full package gate.
Review the available Git history separately before any later visibility change;
record its coverage and limitations rather than claiming the scanner proves
confidentiality. Assets require a separate human or visual content review.

## Acceptance Criteria

- [x] Current repository text and editor settings contain no identified private-product remnants.
- [x] Public-boundary checks cover tracked and new candidate text, including editor configuration.
- [x] Synthetic negative fixtures fail with a nonzero code and no sensitive-value output.
- [x] README commands, deployment install policy and dependency guidance match maintained source.
- [x] History and asset review scope and any limitations are recorded before visibility is changed.
- [x] Required quality gates and both review axes pass on the final delivery head.

## Failure Behavior

A protected-term finding blocks validation. An unreadable candidate file or
invalid audit input fails closed. Binary assets are explicitly outside text
scanner coverage. No failure authorizes automatic deletion of source or history.

## Out of Scope

Changing repository visibility, deleting Git history, editing other repositories,
altering the Orbz package, or claiming a complete secret/privacy audit from text
matching alone. UI layout and runtime security belong to separate specs.

## Evidence and Promotion

Promote the public boundary into repository context, security rules and a
deterministic shell audit. Keep raw findings and historical inspection logs out
of committed content. Final CI and review evidence is linked below.

History review on 2026-09-06 covered four existing branch heads, zero tags and
30 distinct reachable commits (22 on main and eight on an older release branch).
Commit patches, the initial lockfile content and the sole PNG asset were
reviewed. No business mechanisms or credentials were identified in that scope;
former editor associations and an audit denylist remain in historical revisions.
The current cleanup does not rewrite those revisions. The asset was visually
reviewed as a public product graphic. This is scoped inspection, not a guarantee
that automated matching detects every possible disclosure.

Earlier local implementation evidence on 2026-09-06: frozen installation completed with
pnpm 10.32.1 and Node 24.19.0; all harness audits, TypeScript, targeted Biome,
shell syntax and the 22 current behavioral tests passed. The four new local
skills passed the skill-creator metadata validator. Final build/CI and both
review axes remain the coordinating delivery step. No merge or visibility
change is included in this local evidence.

## Integration evidence — 2026-09-06

The assembled implementation passed `pnpm check` with Node 24.19.0 and
pnpm 10.32.1: all source audits, 22 behavioral tests, formatting, lint,
TypeScript and the production build. Five pre-existing CSS style warnings
remain non-blocking. Pagefind indexed 19 documentation pages.
`pnpm audit --prod --json` reported zero known vulnerabilities after the
scoped XML-parser patch. This is registry advisory evidence at this date.

Generated HTML checks for `/` and `/orbz` confirmed a single main landmark and
headline, the visible code example, all five color inputs, the default native
orb size, safe npm link and shared canonical/title. The alias imports the
canonical authored page, so both routes render the same homepage.

The cloud browser rejected localhost with `ERR_BLOCKED_BY_CLIENT`. Visual,
keyboard, responsive/theme and real speech playback acceptance therefore remain
unverified; source/controller/build evidence does not replace them. No field
Core Web Vitals or complete WCAG conformance is claimed. CI and final reviewed
head are recorded in the delivery PR.

The independent source review found and resolved protected-filename logging and
dangling-symlink handling in the privacy audit. Both gained negative regression
coverage; the resulting suite passes all 24 behavioral tests.

## Closure evidence

[CI run 34016935765](https://github.com/NeonGate-AI/docs/actions/runs/34016935765)
completed successfully for implementation commit
`7f01fe42777e015aed831f33277f9fdda0e2ad73`, including all 24 tests, audits,
formatting, lint, type checks, build, registry audit and hook validation.
Independent Standards and source Spec-fidelity reviews found no remaining
blocking findings on the identical reviewed tree
`92cf2169a65b55630916902eb6797a3e0d173f46`.

This closes the public-source/harness acceptance owned by this spec. The UI's
remaining browser acceptance belongs to SPEC-006/007, which stay in progress.
The preview requires Vercel sign-in and the current connector lacks project-team
access; no preview protection or repository visibility was changed. Final
documentation-head CI and review are recorded in PR #7 before handoff.
