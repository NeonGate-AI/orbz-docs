---
id: SPEC-005
title: Strengthen the documentation harness without a CLI
type: governance
status: in-progress
mode: prospective
created: 2026-09-06
updated: 2026-09-06
owners:
  - NeonGate AI
targets:
  - engineering guidance and reusable workflows
  - spec and skill invariant checks
  - shell automation and package quality gates
context:
  - .agents/context/repository.md
  - .agents/context/workflow-skills.md
rules:
  - .agents/rules/003-context-engineering.rule.md
  - .agents/rules/011-spec-driven-development.rule.md
  - .agents/rules/012-security-privacy.rule.md
adrs:
  - .agents/adrs/0002-quality-gates-as-layered-evidence.adr.md
skills:
  - .agents/skills/to-spec/SKILL.md
  - .agents/skills/implement/SKILL.md
  - .agents/skills/code-review/SKILL.md
evidence:
  - .audits/specs.audit.sh
  - .audits/workflow-skills.audit.sh
  - .audits/guardrails.audit.sh
  - scripts/harness.test.ts
  - scripts/editor-guardrails.test.ts
  - .github/workflows/ci.yml
  - pending
---

# SPEC-005: Strengthen the documentation harness without a CLI

## Problem Statement

Docs has a useful SDD harness, but its spec audit can accept false completion,
skill routing lacks focused discovery and maintenance procedures, and contributor
guidance still depends on an unnecessary engineering CLI.

## Solution

Keep the existing context, rules, specs, ADRs, prompts, roles and audit structure.
Add useful reusable workflows and local grilling, optional grill-me,
writing-for-agents and harness-maintenance procedures. Add an optional, tested
Cursor adapter for local shell safety, advisory edit feedback and review-only
delegation; it wraps the same package checks and performs no network access. Enforce actual evidence
and local-reference contracts with negative regression fixtures. Use package
scripts and shell entrypoints, with typed backends where parsing needs them.

## Scope

The owner authorized the requested harness parity and implementation. No CLI is
created. Remove the unused Neon engineering dependency, preserving the exact
lockfile and ordinary pnpm workflow. Docs delivery continues through PRs to main.

## Decisions and Constraints

Numbered IDs remain stable. Completed specs cannot contain pending evidence or
unchecked acceptance. Missing historical evidence remains pending rather than
being checked for audit compliance. Existing authorization remains authoritative;
discovery asks only consequential unresolved decisions. A harness score is a
diagnostic, not a reason to add unused editor integrations or services.

## Testing Decisions

### Primary seam

Run `pnpm test` against isolated repository fixtures that prove rejection of
unchecked completion, pending evidence, mismatched catalog status, missing local
references and malformed skill metadata, while accepting a valid fixture.

### Required validation

Run shell syntax and behavior checks, `pnpm harness:check`, TypeScript/Biome,
production build and pinned-toolchain CI. Run `npx harness-score` before and after
with the same scorer version; report all dimensions and explain genuine gaps.

## Acceptance Criteria

- [x] Spec checks enforce metadata, catalog parity, local references and honest completion evidence.
- [x] Skill checks enforce activation metadata, discoverability and usable local references.
- [x] Focused regression tests reject realistic malformed fixtures and accept valid input.
- [x] Reusable discovery, harness, documentation, regression and review workflows are locally discoverable.
- [x] Optional editor hooks enforce their declared safety/feedback behavior under regression tests.
- [x] No custom CLI or Neon dependency remains; executable repository automation uses shell entrypoints.
- [ ] Baseline and final score evidence use the same tool version without decorative integrations.
- [ ] Required quality gates and both review axes pass on the final delivery head.

## Failure Behavior

An invalid spec/skill fails with a path-oriented error. Failed or absent external
scoring is reported separately from deterministic local checks. Unresolved user
decisions keep the related spec draft; settled decisions do not force a new
interview or repeat authorization.

## Out of Scope

Application CLI development, another repository's product rules/specs, changing
the docs branch model, visibility changes, unused integrations/MCP services,
runtime product changes or claiming browser/field quality from a harness score.

## Evidence and Promotion

Baseline on 2026-09-06: `npx --yes harness-score` resolved version 1.6.5 and reported
75/108 (69%), L3: Context 20/20, Skills 9/17, Hooks 0/14, Sensors 12/20,
CI 14/14, Hygiene 20/23. This detector does not credit every existing Husky hook
or generic role document. New tests and workflows must serve real maintainer
tasks. Final score, CI and independent reviews remain pending.

Local implementation evidence on 2026-09-06: frozen installation completed with
pnpm 10.32.1 and Node 24.19.0; all harness audits, TypeScript, targeted Biome,
shell syntax and the 22 current behavioral tests passed. The four new local
skills passed the skill-creator metadata validator. Final build/CI and both
review axes remain the coordinating delivery step. No merge or visibility
change is included in this local evidence.

A subsequent same-version measurement reported 103/108 (95%), L4. The remaining
score gaps are an absent optional MCP configuration and a detector that treats
the required Cursor agents README as an agent missing activation metadata. The
actual review-only agent has metadata; the README is documentation. Neither gap
is repaired with a nonfunctional integration or a fake agent. Final scoring is
recorded after the complete delivery is reviewed.

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

Final `harness-score@1.6.5`: **103/108 (95%), L4**, up from 75/108 (69%), L3.

| Dimension | Before | After |
|---|---:|---:|
| Context & Guides | 20/20 | 20/20 |
| Skills & Commands | 9/17 | 15/17 |
| Hooks & Guardrails | 0/14 | 14/14 |
| Sensors & Feedback | 12/20 | 20/20 |
| CI Feedback | 14/14 | 14/14 |
| Hygiene & Safety | 20/23 | 20/23 |

The remaining five points are the absent, unnecessary MCP configuration and
a detector false positive treating `.cursor/agents/README.md` as a delegate
without activation metadata. The actual reviewer has name/description metadata.
The directory README remains documentation rather than a fake agent.

The independent source review found and resolved protected-filename logging and
dangling-symlink handling in the privacy audit. Both gained negative regression
coverage; the resulting suite passes all 24 behavioral tests.
