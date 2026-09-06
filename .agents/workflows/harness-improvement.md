# Harness Improvement

1. Read the active governance spec and use the local harness-maintenance skill.
2. Run `npx harness-score` explicitly and record the resolved version, dimensions
   and observation date. Reuse that version for before/after comparison.
3. Map each gap to a real maintainer failure or repetitive task. Detector gaps
   are documented; unused editor integrations and services are not created.
4. Change the smallest owning rule/context/skill/workflow and its regression test.
5. Run `pnpm test`, `pnpm harness:check` and the full `pnpm check` gate.
6. Re-run the same scorer and record the delta with its limitations in the spec.
7. Use [review](review.md) before any authorized integration.
