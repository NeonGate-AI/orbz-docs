# Review

Read the local [code-review skill](../skills/code-review/SKILL.md), active spec,
applicable rules and actual diff. Use separate Standards and Spec-fidelity lenses.

Record the merge base, reviewed head, evidence and blocking findings in the PR.
Check security/privacy, accessibility, SEO and performance only at the evidence
class the change requires; automation is not WCAG or field-CWV conformance.

A changed head invalidates the final review. Required CI and deployment checks
must pass before an authorized merge. Use the branch target recorded in the spec
and rule 011, including an explicit owner-requested staging target. A PR alone
does not authorize promotion or merge. Existing user authorization remains authoritative.
