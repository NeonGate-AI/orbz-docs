# Orbz Docs Spec-Driven Workflow

This is the canonical delivery lifecycle for consequential bounded changes.
Local skills implement parts of the lifecycle; they do not replace it.

## Sources of truth

```text
repository reality + owner decision
              ↓
         numbered spec
              ↓
 implementation + evidence
              ↓
  promoted rules/context/ADRs
              ↓
 standards review + spec review
```

## Status model

`draft -> ready -> in-progress -> implemented`

A spec may become `superseded` or `retired` when appropriate. A prospective spec
must be `ready` before implementation begins.

## Lifecycle

1. **Discover:** load `AGENTS.md`, scoped context, applicable rules, existing
   specs/ADRs and the implementation/content surface.
2. **Specify:** use `to-spec` to create a checkable contract with acceptance and
   evidence requirements.
3. **Approve:** resolve consequential decisions and mark the spec `ready`.
4. **Decompose:** use `to-tickets` when work benefits from multiple tracer-bullet
   slices; small specs may remain one implementation slice.
5. **Implement:** mark `in-progress`; use `implement` and `tdd` at observable seams.
6. **Evidence:** store temporary logs/reports in `.audits/`; keep durable evidence
   in tests, source, the spec and PR.
7. **Promote:** move lasting constraints/decisions to rules/context/ADRs without
   duplicating ownership.
8. **Close:** check acceptance criteria and mark `implemented` only when the
   required evidence is reproducible.
9. **Review:** run the full gate and `code-review` on two axes: Standards and Spec
   fidelity. A head change invalidates the previous final review.
10. **Merge:** merge only the reviewed, green head.

## Documentation quality impact

Every spec that changes public pages, metadata, navigation or docs UI states
which of these apply: content accuracy, accessibility, technical SEO,
performance/CWV risk, privacy/security and search discovery.

## Retrospective specs

Retrospective mode is allowed for existing capability. It must identify concrete
repository evidence and cannot claim that historical implementation followed this
workflow when that cannot be proven.
