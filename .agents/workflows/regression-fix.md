# Regression Fix

1. Reproduce the reported observable failure and identify the governing spec.
2. Create a bounded fix spec through local to-spec if behavior changes.
3. Add a test at the practical public seam, demonstrate the failure and apply the
   smallest correction using local implement/TDD procedures.
4. Keep the failing check intact; an accepted contract change updates the spec
   before implementation. Preserve historical pending evidence honestly.
5. Run focused checks, `pnpm check` and [review](review.md).

Completion: the regression is prevented and the evidence identifies the reviewed
head. A future deployment observation remains pending until observed.
